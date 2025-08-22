import { View, Text, Dimensions } from 'react-native'
import { Canvas, Circle, Path, Skia, } from '@shopify/react-native-skia'
import { useSharedValue, useDerivedValue } from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';

const {width, height} = Dimensions.get('window')

const MoodSlider = () => {
    const strokeWidth = 15;
    const centerX = width / 2;           // Horizontal center
    const centerY = height * 0.55;        // Position arc lower on screen
    const r = (width - strokeWidth) / 2 - 10; // Add padding
    
    // For TOP half of semicircle - flatter curve
    const startAngle = Math.PI * 1.25;  // 225° (top-left)
    const endAngle = Math.PI * 1.75;    // 315° (top-right)
    
    // Alternative: Even flatter top curve
    // const startAngle = Math.PI * 1.15;  // ~207° 
    // const endAngle = Math.PI * 1.85;    // ~333°

    // Calculate arc endpoints
    const x1 = centerX + r * Math.cos(startAngle);  // Top-left point
    const y1 = centerY + r * Math.sin(startAngle);  // Above center
    const x2 = centerX + r * Math.cos(endAngle);    // Top-right point  
    const y2 = centerY + r * Math.sin(endAngle);    // Above center

    // Arc path for TOP half (sweep-flag = 1 for clockwise)
    const backgroundPath = `M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`;
    const skiaBackgroundPath = Skia.Path.MakeFromSVGString(backgroundPath);

    if (!skiaBackgroundPath) {
        return (
            <View>
                <Text>Path creation failed!</Text>
                <Text>Path string: {backgroundPath}</Text>
            </View>
        );
    }

    // Creating the movable tab - start at left side
    const movableCx = useSharedValue(x1)
    const movableCy = useSharedValue(y1)
    const previousCx = useSharedValue(x1)
    const previousCy = useSharedValue(y1)

    const constrainedSkiaCx = useDerivedValue(() => {
        const deltaX = movableCx.value - centerX;
        const deltaY = movableCy.value - centerY;
        let touchAngle = Math.atan2(deltaY, deltaX);
        
        // Normalize to 0-2π range
        if (touchAngle < 0) touchAngle += 2 * Math.PI;
        
        // For TOP arc: check if within range (225° to 315°)
        let progress;
        
        if (touchAngle >= startAngle && touchAngle <= endAngle) {
            // Within arc range - calculate progress
            progress = (touchAngle - startAngle) / (endAngle - startAngle);
        } else {
            // Outside range - snap to nearest end
            const distanceToStart = Math.abs(touchAngle - startAngle);
            const distanceToEnd = Math.abs(touchAngle - endAngle);
            
            // Handle wrap-around cases
            const distanceToStartAlt = Math.abs(touchAngle - startAngle + 2 * Math.PI);
            const distanceToEndAlt = Math.abs(touchAngle - endAngle - 2 * Math.PI);
            
            const minDistStart = Math.min(distanceToStart, distanceToStartAlt);
            const minDistEnd = Math.min(distanceToEnd, distanceToEndAlt);
            
            progress = minDistStart < minDistEnd ? 0 : 1;
        }
        
        // Convert progress back to angle
        const finalAngle = startAngle + progress * (endAngle - startAngle);
        return centerX + r * Math.cos(finalAngle);
    });

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
        
        const finalAngle = startAngle + progress * (endAngle - startAngle);
        return centerY + r * Math.sin(finalAngle);
    });

    const gesture = Gesture.Pan()
        .onUpdate(({ translationX, translationY }) => {
            movableCx.value = translationX + previousCx.value;
            movableCy.value = translationY + previousCy.value;
        })
        .onEnd(() => {
            previousCx.value = movableCx.value;
            previousCy.value = movableCy.value;
        });

    return (
        <View style={{ flex: 1, paddingTop: 100, width:"100%" }}>
            <Text style={{ textAlign: 'center', marginBottom: 20 }}>MoodSlider - Top Arc</Text>
            <GestureDetector gesture={gesture} >
                <Canvas style={{ flex: 1 }}>
                    <Path
                        path={skiaBackgroundPath}
                        strokeCap="round"
                        strokeWidth={strokeWidth}
                        color="pink"
                        style="stroke"
                    />
                    <Circle
                        r={20}
                        cx={constrainedSkiaCx}
                        cy={constrainedSkiaCy}
                        color={"white"}
                    />
                    <Circle
                        r={20}
                        cx={constrainedSkiaCx}
                        cy={constrainedSkiaCy}
                        color={"#007AFF"}
                        style={"stroke"}
                        strokeWidth={3}
                    />
                </Canvas>
            </GestureDetector>
        </View>
    );
};

export default MoodSlider;