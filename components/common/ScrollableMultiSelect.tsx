import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';

interface SelectionOption {
  key: string;
  label: string;
  icon: string;
}

interface ScrollableMultiSelectProps {
  options: SelectionOption[];
  selectedValues: string[];
  onSelectionChange: (selectedValues: string[]) => void;
  multiSelect?: boolean;
  itemsPerRow?: number;
  containerHeight?: number;
  itemWidth?: number;
  itemHeight?: number;
  selectedColor?: string;
  unselectedColor?: string;
  selectedTextColor?: string;
  unselectedTextColor?: string;
  selectedIconColor?: string;
  unselectedIconColor?: string;
  iconSize?: number;
  fadeWidth?: number;
  showShadow?: boolean;
}

const ScrollableMultiSelect: React.FC<ScrollableMultiSelectProps> = ({
  options,
  selectedValues,
  onSelectionChange,
  multiSelect = true,
  itemsPerRow = 2,
  containerHeight = 300,
  itemWidth = 112, // w-28 = 112px
  itemHeight = 128, // h-32 = 128px
  selectedColor = '#fce7f3', // bg-pink-100
  unselectedColor = '#f8fafc', // bg-slate-50
  selectedTextColor = '#f472b6', // text-pink-400
  unselectedTextColor = '#475569', // text-slate-600
  selectedIconColor = '#f472b6',
  unselectedIconColor = '#64748b',
  iconSize = 24,
  fadeWidth = 40,
  showShadow = true,
}) => {
  const handleSelection = (optionKey: string) => {
    let newSelectedValues;
    
    if (multiSelect) {
      if (selectedValues.includes(optionKey)) {
        newSelectedValues = selectedValues.filter((key) => key !== optionKey);
      } else {
        newSelectedValues = [...selectedValues, optionKey];
      }
    } else {
      newSelectedValues = selectedValues.includes(optionKey) ? [] : [optionKey];
    }
    
    onSelectionChange(newSelectedValues);
  };

  const renderOption = (option: SelectionOption) => {
    const isSelected = selectedValues.includes(option.key);
    
    return (
      <TouchableOpacity
        key={option.key}
        onPress={() => handleSelection(option.key)}
        style={{
          width: itemWidth,
          height: itemHeight,
          borderRadius: 16,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: isSelected ? selectedColor : unselectedColor,
          ...(showShadow && {
            shadowColor: '#000',
            shadowOffset: {
              width: 4,
              height: 4,
            },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }),
        }}
      >
        <View 
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#fce7f3', // Always pink-100 for icon background
          }}
        >
          <MaterialCommunityIcons 
            name={option.icon} 
            size={iconSize} 
            color={isSelected ? selectedIconColor : unselectedIconColor} 
          />
        </View>
        
        <Text 
          style={{
            fontWeight: '600',
            textAlign: 'center',
            marginTop: 8,
            fontSize: 12,
            color: isSelected ? selectedTextColor : unselectedTextColor,
          }}
        >
          {option.label}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderRows = () => {
    const rows = [];
    const itemsPerRowCount = Math.ceil(options.length / itemsPerRow);
    
    for (let i = 0; i < itemsPerRow; i++) {
      const rowOptions = options.slice(i * itemsPerRowCount, (i + 1) * itemsPerRowCount);
      if (rowOptions.length === 0) break;
      
      rows.push(
        <View key={`row-${i}`} style={{ flexDirection: 'row', gap: 12 }}>
          {rowOptions.map(renderOption)}
        </View>
      );
    }
    
    return rows;
  };

  return (
    <View style={{ width: '100%', position: 'relative', height: containerHeight }}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 30 }}
        style={{ zIndex: 1 }}
      >
        <View style={{ flexDirection: 'column', paddingVertical: 16, gap: 20 }}>
          {renderRows()}
        </View>
      </ScrollView>
      
      {/* Left fade gradient */}
      <LinearGradient 
        colors={['rgba(255,255,255,1)', 'rgba(255,255,255,0)']} 
        start={{ x: 0, y: 0 }} 
        end={{ x: 1, y: 0 }} 
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: fadeWidth,
          zIndex: 10,
        }}
        pointerEvents="none"
      />
 
      {/* Right fade gradient */}
      <LinearGradient 
        colors={['rgba(255,255,255,0)', 'rgba(255,255,255,1)']} 
        start={{ x: 0, y: 0 }} 
        end={{ x: 1, y: 0 }} 
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: fadeWidth,
          zIndex: 10,
        }}
        pointerEvents="none"
      />
    </View>
  );
};

export default ScrollableMultiSelect;