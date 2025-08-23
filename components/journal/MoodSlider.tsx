import { View, Text, Dimensions } from 'react-native'
import { Canvas, Circle, Path, Skia, Line } from '@shopify/react-native-skia'
import { useSharedValue, useDerivedValue, runOnJS } from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { useState, useEffect, useMemo, useCallback } from 'react';

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
    showCurrentDisplay = false,
    showSteps = false, // Control step indicator visibility
    slotLength = 10, // Length of the vertical slot indicators
    slotWidth = 6,   // Width of the vertical slot indicators
    minSliderHeight = 120, // Minimum height for slider section
    maxSliderHeight = 200, // Maximum height for slider section
}) => {
    // State for UI updates
    const [currentStep, setCurrentStep] = useState(null);
    const [currentProgress, setCurrentProgress] = useState(0.5);
    const [containerDimensions, setContainerDimensions] = useState({ width: width, height: height });
    const [isLayoutComplete, setIsLayoutComplete] = useState(false);
    
    // Determine if we're in stepped or continuous mode
    const isSteppedMode = steps && steps.length > 0;
    
    // Calculate optimal slider dimensions
    const sliderDimensions = useMemo(() => {
        const containerWidth = containerDimensions.width;
        
        // Calculate ideal radius based on container width with padding
        const maxPossibleRadius = (containerWidth - strokeWidth - 60) / 2; // 60px total padding
        const idealRadius = Math.max(60, Math.min(maxPossibleRadius, 200)); // Between 60-100px
        
        // Calculate required height for the arc + padding
        // For a semicircle from 216° to 324°, we need space above the center
        const arcSpan = Math.PI * 0.6; // 216° to 324° span
        
        // Calculate the highest point of the arc
        const topAngle = Math.PI * 1.5; // 270° (top of circle)
        const topPoint = idealRadius * Math.sin(topAngle - Math.PI * 1.2); // Relative to start angle
        
        // Calculate center position that ensures the arc is fully visible
        const topPadding = 30; // Padding from top
        const bottomPadding = 40; // Padding from bottom
        const centerY = Math.abs(topPoint) + topPadding + idealRadius * 0.4;
        
        const requiredHeight = centerY + idealRadius * 0.5 + bottomPadding;
        const optimalHeight = Math.max(minSliderHeight, Math.min(maxSliderHeight, requiredHeight));
        
        return {
            width: containerWidth,
            height: optimalHeight,
            radius: idealRadius,
            centerX: containerWidth / 2,
            centerY: centerY, // Dynamic center position to prevent clipping
        };
    }, [containerDimensions.width, strokeWidth, minSliderHeight, maxSliderHeight]);
    
    // Arc angles for optimal coverage
    const startAngle = Math.PI * 1.2;   // 216°
    const endAngle = Math.PI * 1.8;     // 324°
    
    // Memoized step positions
    const stepPositions = useMemo(() => {
        if (!isSteppedMode || !steps.length) return [];
        
        const { centerX, centerY, radius } = sliderDimensions;
        
        return steps.map((step, index) => {
            const progress = steps.length === 1 ? 0.5 : index / (steps.length - 1);
            const angle = startAngle + progress * (endAngle - startAngle);
            const baseX = centerX + radius * Math.cos(angle);
            const baseY = centerY + radius * Math.sin(angle);
            
            // Calculate perpendicular direction for the slot
            const perpAngle = angle + Math.PI / 2;
            const halfSlot = slotLength / 2;
            
            return {
                ...step,
                progress,
                angle,
                x: baseX,
                y: baseY,
                slotStartX: baseX + halfSlot * Math.cos(perpAngle),
                slotStartY: baseY + halfSlot * Math.sin(perpAngle),
                slotEndX: baseX - halfSlot * Math.cos(perpAngle),
                slotEndY: baseY - halfSlot * Math.sin(perpAngle)
            };
        });
    }, [steps, isSteppedMode, sliderDimensions, slotLength, startAngle, endAngle]);
    
    // Memoized arc path
    const arcPath = useMemo(() => {
        const { centerX, centerY, radius } = sliderDimensions;
        
        const x1 = centerX + radius * Math.cos(startAngle);
        const y1 = centerY + radius * Math.sin(startAngle);
        const x2 = centerX + radius * Math.cos(endAngle);
        const y2 = centerY + radius * Math.sin(endAngle);
        
        const pathString = `M ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2}`;
        return Skia.Path.MakeFromSVGString(pathString);
    }, [sliderDimensions, startAngle, endAngle]);
    
    // Calculate initial position
    const getInitialPosition = useCallback(() => {
        const { centerX, centerY, radius } = sliderDimensions;
        
        if (isSteppedMode && initialStep !== null && stepPositions.length > 0) {
            const stepIndex = typeof initialStep === 'number' ? initialStep : 
                             steps.findIndex(step => step === initialStep);
            const validIndex = Math.max(0, Math.min(stepIndex, steps.length - 1));
            return stepPositions[validIndex];
        } else if (!isSteppedMode && typeof initialStep === 'number') {
            const progress = Math.max(0, Math.min(initialStep, 1));
            const angle = startAngle + progress * (endAngle - startAngle);
            return {
                x: centerX + radius * Math.cos(angle),
                y: centerY + radius * Math.sin(angle)
            };
        } else {
            // Default to middle
            const angle = startAngle + 0.5 * (endAngle - startAngle);
            return {
                x: centerX + radius * Math.cos(angle),
                y: centerY + radius * Math.sin(angle)
            };
        }
    }, [sliderDimensions, isSteppedMode, initialStep, stepPositions, steps, startAngle, endAngle]);
    
    // Shared values for slider position
    const initialPos = getInitialPosition();
    const movableCx = useSharedValue(initialPos.x);
    const movableCy = useSharedValue(initialPos.y);
    const previousCx = useSharedValue(initialPos.x);
    const previousCy = useSharedValue(initialPos.y);
    
    // Shared values to track previous state
    const prevStepProgress = useSharedValue(-1);
    const prevContinuousProgress = useSharedValue(-1);
    
    // Create stable callback functions using useCallback with empty deps
    const updateStepState = useCallback((newStep, newProgress) => {
        setCurrentStep(newStep);
        if (onStepChange) onStepChange(newStep);
    }, []);
    
    const updateProgressState = useCallback((newProgress) => {
        setCurrentProgress(newProgress);
        if (onProgressChange) onProgressChange(newProgress);
    }, []);
    
    // Define calculateProgress as a worklet function
    const calculateProgress = (touchAngle, startAngle, endAngle) => {
        'worklet';
        // Normalize angles to 0-2π range
        const normalize = (angle) => {
            while (angle < 0) angle += 2 * Math.PI;
            while (angle >= 2 * Math.PI) angle -= 2 * Math.PI;
            return angle;
        };
        
        const normalizedTouch = normalize(touchAngle);
        const normalizedStart = normalize(startAngle);
        const normalizedEnd = normalize(endAngle);
        
        // Check if touch is within arc range
        if (normalizedTouch >= normalizedStart && normalizedTouch <= normalizedEnd) {
            return (normalizedTouch - normalizedStart) / (normalizedEnd - normalizedStart);
        }
        
        // Find closest endpoint
        const distToStart = Math.min(
            Math.abs(normalizedTouch - normalizedStart),
            2 * Math.PI - Math.abs(normalizedTouch - normalizedStart)
        );
        const distToEnd = Math.min(
            Math.abs(normalizedTouch - normalizedEnd),
            2 * Math.PI - Math.abs(normalizedTouch - normalizedEnd)
        );
        
        return distToStart < distToEnd ? 0 : 1;
    };
    
    // Constrained X position
    const constrainedSkiaCx = useDerivedValue(() => {
        const { centerX, centerY, radius } = sliderDimensions;
        const deltaX = movableCx.value - centerX;
        const deltaY = movableCy.value - centerY;
        let touchAngle = Math.atan2(deltaY, deltaX);
        
        if (touchAngle < 0) touchAngle += 2 * Math.PI;
        
        const progress = calculateProgress(touchAngle, startAngle, endAngle);
        
        if (isSteppedMode) {
            // Check for snapping to step points
            const currentAngle = startAngle + progress * (endAngle - startAngle);
            const currentX = centerX + radius * Math.cos(currentAngle);
            const currentY = centerY + radius * Math.sin(currentAngle);
            
            for (const stepPos of stepPositions) {
                const distance = Math.sqrt(
                    Math.pow(currentX - stepPos.x, 2) + Math.pow(currentY - stepPos.y, 2)
                );
                if (distance < snapThreshold) {
                    if (prevStepProgress.value !== stepPos.progress) {
                        prevStepProgress.value = stepPos.progress;
                        runOnJS(updateStepState)(stepPos, stepPos.progress);
                    }
                    return stepPos.x;
                }
            }
        } else {
            // Continuous mode
            const roundedProgress = Math.round(progress * 100) / 100;
            if (Math.abs(prevContinuousProgress.value - roundedProgress) > 0.01) {
                prevContinuousProgress.value = roundedProgress;
                runOnJS(updateProgressState)(roundedProgress);
            }
        }
        
        const finalAngle = startAngle + progress * (endAngle - startAngle);
        return centerX + radius * Math.cos(finalAngle);
    }, [sliderDimensions, isSteppedMode, stepPositions, snapThreshold, startAngle, endAngle]);
    
    // Constrained Y position
    const constrainedSkiaCy = useDerivedValue(() => {
        const { centerX, centerY, radius } = sliderDimensions;
        const deltaX = movableCx.value - centerX;
        const deltaY = movableCy.value - centerY;
        let touchAngle = Math.atan2(deltaY, deltaX);
        
        if (touchAngle < 0) touchAngle += 2 * Math.PI;
        
        const progress = calculateProgress(touchAngle, startAngle, endAngle);
        
        if (isSteppedMode) {
            const currentAngle = startAngle + progress * (endAngle - startAngle);
            const currentX = centerX + radius * Math.cos(currentAngle);
            const currentY = centerY + radius * Math.sin(currentAngle);
            
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
        return centerY + radius * Math.sin(finalAngle);
    }, [sliderDimensions, isSteppedMode, stepPositions, snapThreshold, startAngle, endAngle]);
    
    // Initialize state - run only once when layout is complete
    useEffect(() => {
        if (!isLayoutComplete) return;
        
        if (isSteppedMode && stepPositions.length > 0) {
            const initialStepObj = stepPositions[Math.floor(stepPositions.length / 2)] || stepPositions[0];
            setCurrentStep(initialStepObj);
            // Only call onStepChange if it exists and is different from current
            if (onStepChange && currentStep !== initialStepObj) {
                onStepChange(initialStepObj);
            }
        } else {
            setCurrentProgress(0.5);
            // Only call onProgressChange if it exists and is different from current
            if (onProgressChange && Math.abs(currentProgress - 0.5) > 0.01) {
                onProgressChange(0.5);
            }
        }
    }, [isLayoutComplete]); // Only depend on layout completion
    
    // Update shared values when dimensions change
    useEffect(() => {
        if (isLayoutComplete) {
            const newInitialPos = getInitialPosition();
            movableCx.value = newInitialPos.x;
            movableCy.value = newInitialPos.y;
            previousCx.value = newInitialPos.x;
            previousCy.value = newInitialPos.y;
        }
    }, [isLayoutComplete, sliderDimensions]); // Only depend on layout and dimensions
    
    const gesture = Gesture.Pan()
        .onUpdate(({ translationX, translationY }) => {
            movableCx.value = translationX + previousCx.value;
            movableCy.value = translationY + previousCy.value;
        })
        .onEnd(() => {
            previousCx.value = constrainedSkiaCx.value;
            previousCy.value = constrainedSkiaCy.value;
        });

    const handleContainerLayout = useCallback((event) => {
        const { width: w, height: h } = event.nativeEvent.layout;
        setContainerDimensions({ width: w, height: h });
        setIsLayoutComplete(true);
    }, []);
    
    // Calculate responsive font sizes
    const responsiveFontSizes = useMemo(() => ({
        emoji: Math.min(80, containerDimensions.width * 0.2),
        label: Math.min(28, containerDimensions.width * 0.07),
        progress: Math.min(36, containerDimensions.width * 0.09)
    }), [containerDimensions.width]);
    
    // Render fallback during layout
    if (!isLayoutComplete) {
        return (
            <View style={{ flex: 1, width: "100%" }} onLayout={handleContainerLayout}>
                {showCurrentDisplay && (
                    <View style={{ 
                        flex: 1,
                        justifyContent: 'center', 
                        alignItems: 'center',
                        paddingHorizontal: 20,
                        paddingVertical: 20
                    }}>
                        <Text style={{ 
                            fontSize: 32, 
                            fontWeight: 'bold', 
                            color: '#666'
                        }}>
                            Loading...
                        </Text>
                    </View>
                )}
            </View>
        );
    }
    
    if (!arcPath) {
        return (
            <View style={{ flex: 1, width: "100%", justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 16, color: '#666' }}>Unable to render slider</Text>
            </View>
        );
    }
    
    return (
        <View style={{ flex: 1, width: "100%" }}>            
            {/* Current state display - takes remaining space */}
            {showCurrentDisplay && (
                <View style={{ 
                    flex: 1,
                    justifyContent: 'center', 
                    alignItems: 'center',
                    paddingHorizontal: 20,
                    paddingTop: 20,
                    paddingBottom: 10
                }}>
                    {isSteppedMode ? (
                        <View className='flex flex-col justify-center items-center'>
                            <Text style={{ 
                                fontSize: responsiveFontSizes.emoji, 
                                marginBottom: 15 
                            }}>
                                {currentStep?.emoji || '😐'}
                            </Text>
                            <Text style={{ 
                                fontSize: responsiveFontSizes.label, 
                                fontWeight: 'bold', 
                                color: currentStep?.color || handleBorderColor,
                                textAlign: 'center',
                                lineHeight: responsiveFontSizes.label * 1.2
                            }}>
                                {currentStep?.label || 'Unknown'}
                            </Text>
                        </View>
                    ) : (
                        <Text style={{ 
                            fontSize: responsiveFontSizes.progress, 
                            fontWeight: 'bold', 
                            color: '#007AFF'
                        }}>
                            {Math.round(currentProgress * 100)}%
                        </Text>
                    )}
                </View>
            )}

            {/* Slider section - fixed optimal height */}
            <View style={{ 
                height: sliderDimensions.height,
                width: "100%",
                 // Bottom padding to prevent clipping
            }}>
                <GestureDetector gesture={gesture}>
                    <Canvas style={{ flex: 1, width: "100%" }}>
                        {/* Background arc */}
                        <Path
                            path={arcPath}
                            strokeCap="round"
                            strokeWidth={strokeWidth}
                            color={arcColor}
                            style="stroke"
                        />
                        
                        {/* Step indicators */}
                        {isSteppedMode && showSteps && stepPositions.map((step, index) => (
                            <Line
                                key={index}
                                p1={{ x: step.slotStartX, y: step.slotStartY }}
                                p2={{ x: step.slotEndX, y: step.slotEndY }}
                                color={step.color || handleBorderColor}
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
        </View>
    );
};

export default ArcSlider;