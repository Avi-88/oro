import { View, Text, Dimensions } from 'react-native'
import { Canvas, Circle, Path, Skia, Line } from '@shopify/react-native-skia'
import { useSharedValue, useDerivedValue, withSpring, runOnJS } from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { useState, useEffect } from 'react';

const { width, height } = Dimensions.get('window')

const ArcSlider = ({
    steps = null, // Array of step objects or null for continuous mode
    onStepChange = () => {}, // Callback for step changes (step object or null)
    onProgressChange = () => {}, // Callback for progress changes (0-1)
    initialStep = null, // Initial step (for stepped mode) or initial progress (for continuous)
    strokeWidth = 6,
    arcColor = "#E5E5E5",
    handleColor = "white",
    handleBorderColor = "#f472b6",
    handleBorderWidth = 4,
    snapThreshold = 40,
    centerY = height * 0.50,
    showCurrentDisplay = true,
    showSteps = false, // Control step indicator visibility
    slotLength = 10, // Length of the vertical slot indicators
    slotWidth = 6,   // Width of the vertical slot indicators
}) => {
    const centerX = width / 2;
    const r = (width - strokeWidth) / 2 - 10;
    
    // Arc angles for top half semicircle
    const startAngle = Math.PI * 1.25;  // 225°
    const endAngle = Math.PI * 1.75;    // 315°
    
    // State for UI updates
    const [currentStep, setCurrentStep] = useState(null);
    const [currentProgress, setCurrentProgress] = useState(0.5);
    
    // Determine if we're in stepped or continuous mode
    const isSteppedMode = steps && steps.length > 0;
    
    // Calculate step positions for stepped mode
    const stepPositions = isSteppedMode ? steps.map((step, index) => {
        const progress = steps.length === 1 ? 0.5 : index / (steps.length - 1);
        const angle = startAngle + progress * (endAngle - startAngle);
        const baseX = centerX + r * Math.cos(angle);
        const baseY = centerY + r * Math.sin(angle);
        
        // Calculate perpendicular direction for the slot
        const perpAngle = angle + Math.PI; // 90 degrees perpendicular
        const halfSlot = slotLength / 2;
        
        return {
            ...step,
            progress,
            angle,
            x: baseX,
            y: baseY,
            // Start and end points of the vertical slot line
            slotStartX: baseX + halfSlot * Math.cos(perpAngle),
            slotStartY: baseY + halfSlot * Math.sin(perpAngle),
            slotEndX: baseX - halfSlot * Math.cos(perpAngle),
            slotEndY: baseY - halfSlot * Math.sin(perpAngle)
        };
    }) : [];
    
    // Calculate initial position
    const getInitialPosition = () => {
        if (isSteppedMode && initialStep !== null) {
            const stepIndex = typeof initialStep === 'number' ? initialStep : 
                             steps.findIndex(step => step === initialStep);
            const validIndex = Math.max(0, Math.min(stepIndex, steps.length - 1));
            return stepPositions[validIndex];
        } else if (!isSteppedMode && typeof initialStep === 'number') {
            const progress = Math.max(0, Math.min(initialStep, 1));
            const angle = startAngle + progress * (endAngle - startAngle);
            return {
                x: centerX + r * Math.cos(angle),
                y: centerY + r * Math.sin(angle)
            };
        } else {
            // Default to middle
            const angle = startAngle + 0.5 * (endAngle - startAngle);
            return {
                x: centerX + r * Math.cos(angle),
                y: centerY + r * Math.sin(angle)
            };
        }
    };
    
    const initialPos = getInitialPosition();
    
    // Arc path
    const x1 = centerX + r * Math.cos(startAngle);
    const y1 = centerY + r * Math.sin(startAngle);
    const x2 = centerX + r * Math.cos(endAngle);
    const y2 = centerY + r * Math.sin(endAngle);
    const backgroundPath = `M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`;
    const skiaBackgroundPath = Skia.Path.MakeFromSVGString(backgroundPath);
    
    if (!skiaBackgroundPath) {
        return (
            <View>
                <Text>There was a error rendering this component ❌</Text>
            </View>
        );
    }
    
    // Shared values for slider position
    const movableCx = useSharedValue(initialPos.x);
    const movableCy = useSharedValue(initialPos.y);
    const previousCx = useSharedValue(initialPos.x);
    const previousCy = useSharedValue(initialPos.y);
    
    // Shared values to track previous state and prevent unnecessary updates
    const prevStepProgress = useSharedValue(-1);
    const prevContinuousProgress = useSharedValue(-1);
    
    // Helper function to update UI state from JS thread
    const updateUIState = (newStep, newProgress) => {
        if (isSteppedMode) {
            setCurrentStep(newStep);
            onStepChange(newStep);
        } else {
            setCurrentProgress(newProgress);
            onProgressChange(newProgress);
        }
    };
    
    // Constrained X position
    const constrainedSkiaCx = useDerivedValue(() => {
        const deltaX = movableCx.value - centerX;
        const deltaY = movableCy.value - centerY;
        let touchAngle = Math.atan2(deltaY, deltaX);
        
        if (touchAngle < 0) touchAngle += 2 * Math.PI;
        
        let progress;
        if (touchAngle >= startAngle && touchAngle <= endAngle) {
            progress = (touchAngle - startAngle) / (endAngle - startAngle);
        } else {
            const distanceToStart = Math.abs(touchAngle - startAngle);
            const distanceToEnd = Math.abs(touchAngle - endAngle);
            const distanceToStartAlt = Math.abs(touchAngle - startAngle + 2 * Math.PI);
            const distanceToEndAlt = Math.abs(touchAngle - endAngle - 2 * Math.PI);
            
            const minDistStart = Math.min(distanceToStart, distanceToStartAlt);
            const minDistEnd = Math.min(distanceToEnd, distanceToEndAlt);
            
            progress = minDistStart < minDistEnd ? 0 : 1;
        }
        
        if (isSteppedMode) {
            // Check for snapping to step points
            const currentAngle = startAngle + progress * (endAngle - startAngle);
            const currentX = centerX + r * Math.cos(currentAngle);
            const currentY = centerY + r * Math.sin(currentAngle);
            
            for (const stepPos of stepPositions) {
                const distance = Math.sqrt(
                    Math.pow(currentX - stepPos.x, 2) + Math.pow(currentY - stepPos.y, 2)
                );
                if (distance < snapThreshold) {
                    // Only update if step actually changed
                    if (prevStepProgress.value !== stepPos.progress) {
                        prevStepProgress.value = stepPos.progress;
                        runOnJS(updateUIState)(stepPos, stepPos.progress);
                    }
                    return stepPos.x;
                }
            }
        } else {
            // Continuous mode - only update if progress changed significantly
            const roundedProgress = Math.round(progress * 100) / 100; // Round to 2 decimal places
            if (Math.abs(prevContinuousProgress.value - roundedProgress) > 0.01) {
                prevContinuousProgress.value = roundedProgress;
                runOnJS(updateUIState)(null, roundedProgress);
            }
        }
        
        const finalAngle = startAngle + progress * (endAngle - startAngle);
        return centerX + r * Math.cos(finalAngle);
    });
    
    // Constrained Y position
    const constrainedSkiaCy = useDerivedValue(() => {
        const deltaX = movableCx.value - centerX;
        const deltaY = movableCy.value - centerY;
        let touchAngle = Math.atan2(deltaY, deltaX);
        
        if (touchAngle < 0) touchAngle += 2 * Math.PI;
        
        let progress;
        if (touchAngle >= startAngle && touchAngle <= endAngle) {
            progress = (touchAngle - startAngle) / (endAngle - startAngle);
        } else {
            const distanceToStart = Math.abs(touchAngle - startAngle);
            const distanceToEnd = Math.abs(touchAngle - endAngle);
            const distanceToStartAlt = Math.abs(touchAngle - startAngle + 2 * Math.PI);
            const distanceToEndAlt = Math.abs(touchAngle - endAngle - 2 * Math.PI);
            
            const minDistStart = Math.min(distanceToStart, distanceToStartAlt);
            const minDistEnd = Math.min(distanceToEnd, distanceToEndAlt);
            
            progress = minDistStart < minDistEnd ? 0 : 1;
        }
        
        if (isSteppedMode) {
            const currentAngle = startAngle + progress * (endAngle - startAngle);
            const currentX = centerX + r * Math.cos(currentAngle);
            const currentY = centerY + r * Math.sin(currentAngle);
            
            for (const stepPos of stepPositions) {
                const distance = Math.sqrt(
                    Math.pow(currentX - stepPos.x, 2) + Math.pow(currentY - stepPos.y, 2)
                );
                if (distance < snapThreshold) {
                    return stepPos.y;
                }
            }
        }
        
        const finalAngle = startAngle + progress * (endAngle - startAngle);
        return centerY + r * Math.sin(finalAngle);
    });
    
    // Initialize state based on initial position
    useEffect(() => {
        if (isSteppedMode) {
            const initialStepObj = stepPositions[Math.floor(stepPositions.length / 2)] || stepPositions[0];
            setCurrentStep(initialStepObj);
            onStepChange(initialStepObj);
        } else {
            setCurrentProgress(0.5);
            onProgressChange(0.5);
        }
    }, []);
    
    const gesture = Gesture.Pan()
        .onUpdate(({ translationX, translationY }) => {
            movableCx.value = translationX + previousCx.value;
            movableCy.value = translationY + previousCy.value;
        })
        .onEnd(() => {
            previousCx.value = constrainedSkiaCx.value;
            previousCy.value = constrainedSkiaCy.value;
        });
    
    return (
        <View style={{ flex: 1, paddingTop: 100, width: "100%" }}>            
            {/* Current state display */}
            {showCurrentDisplay && (
                <View style={{ alignItems: 'center' }}>
                    {isSteppedMode ? (
                        <>
                            <Text style={{ fontSize: 40, marginBottom: 10 }}>
                                {currentStep?.emoji || '😐'}
                            </Text>
                            <Text style={{ 
                                fontSize: 18, 
                                fontWeight: 'bold', 
                                color: currentStep?.color || '#f472b6'
                            }}>
                                {currentStep?.label || 'Unknown'}
                            </Text>
                        </>
                    ) : (
                        <Text style={{ 
                            fontSize: 24, 
                            fontWeight: 'bold', 
                            color: '#007AFF'
                        }}>
                            {Math.round(currentProgress * 100)}%
                        </Text>
                    )}
                </View>
            )}

            <GestureDetector gesture={gesture}>
                <Canvas style={{ flex: 1, width: "100%" }}>
                    {/* Background arc */}
                    <Path
                        path={skiaBackgroundPath}
                        strokeCap="round"
                        strokeWidth={strokeWidth}
                        color={arcColor}
                        style="stroke"
                    />
                    
                    {/* Vertical slot indicators for stepped mode - only show if showSteps is true */}
                    {isSteppedMode && showSteps && stepPositions.map((step, index) => (
                        <Line
                            key={index}
                            p1={{ x: step.slotStartX, y: step.slotStartY }}
                            p2={{ x: step.slotEndX, y: step.slotEndY }}
                            color={step.color || '#f472b6'}
                            strokeWidth={slotWidth}
                            strokeCap="round"
                        />
                    ))}
                    
                    {/* Main slider handle */}
                    <Circle
                        r={12}
                        cx={constrainedSkiaCx}
                        cy={constrainedSkiaCy}
                        color={handleColor}
                    />
                    <Circle
                        r={12}
                        cx={constrainedSkiaCx}
                        cy={constrainedSkiaCy}
                        color={isSteppedMode ? (currentStep?.color || handleBorderColor) : handleBorderColor}
                        style="stroke"
                        strokeWidth={handleBorderWidth}
                    />
                </Canvas>
            </GestureDetector>
        </View>
    );
};

export default ArcSlider;