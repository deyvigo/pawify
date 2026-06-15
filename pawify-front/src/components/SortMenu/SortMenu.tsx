import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

type SortOption = 'price-asc' | 'price-desc' | 'name-az' | 'name-za' | 'best-selling' | 'best-rated';

interface SortOptionConfig {
  key: SortOption;
  label: string;
  icon: string;
}

const sortOptions: SortOptionConfig[] = [
  { key: 'price-asc', label: 'Menor precio', icon: '↓' },
  { key: 'price-desc', label: 'Mayor precio', icon: '↑' },
  { key: 'name-az', label: 'Nombre A-Z', icon: 'A' },
  { key: 'name-za', label: 'Nombre Z-A', icon: 'Z' },
  { key: 'best-selling', label: 'Más vendidos', icon: '🔥' },
  { key: 'best-rated', label: 'Mejor valorados', icon: '⭐' },
];

interface SortMenuProps {
  activeSort: SortOption;
  onSortSelect: (sort: SortOption) => void;
}

export const SortMenu: React.FC<SortMenuProps> = ({ activeSort, onSortSelect }) => {
  return (
    <View style={styles.container}>
      {sortOptions.map((option) => (
        <TouchableOpacity
          key={option.key}
          style={[styles.option, activeSort === option.key && styles.activeOption]}
          onPress={() => onSortSelect(option.key)}
          activeOpacity={0.7}
        >
          <Text style={styles.icon}>{option.icon}</Text>
          <Text style={[styles.label, activeSort === option.key && styles.activeLabel]}>
            {option.label}
          </Text>
          {activeSort === option.key && <Text style={styles.check}>✓</Text>}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 10,
  },
  activeOption: {
    backgroundColor: '#FFF5F5',
  },
  icon: {
    fontSize: 16,
    width: 20,
    textAlign: 'center',
  },
  label: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
  },
  activeLabel: {
    color: colors.primary,
    fontWeight: '600',
  },
  check: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: 'bold',
  },
});
