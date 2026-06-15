import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated } from 'react-native';
import { colors } from '../../theme/colors';

interface DrawerMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SubCategory {
  name: string;
  count?: number;
}

interface MainCategory {
  name: string;
  icon: string;
  subCategories: SubCategory[];
}

const categories: MainCategory[] = [
  {
    name: 'Perro',
    icon: '🐕',
    subCategories: [
      { name: 'Alimento', count: 45 },
      { name: 'Juguetes', count: 23 },
      { name: 'Higiene', count: 18 },
      { name: 'Camas', count: 12 },
      { name: 'Collares', count: 15 },
      { name: 'Ropa', count: 8 },
    ],
  },
  {
    name: 'Gato',
    icon: '🐈',
    subCategories: [
      { name: 'Alimento', count: 38 },
      { name: 'Juguetes', count: 20 },
      { name: 'Arena', count: 10 },
      { name: 'Camas', count: 14 },
      { name: 'Rascadores', count: 7 },
    ],
  },
  {
    name: 'Otros',
    icon: '🐾',
    subCategories: [
      { name: 'Peces', count: 12 },
      { name: 'Aves', count: 8 },
      { name: 'Roedores', count: 6 },
      { name: 'Reptiles', count: 4 },
    ],
  },
];

const brands = ['Royal Canin', 'Purina', 'Pedigree', 'Whiskas', 'Pro Plan', 'Hill\'s', 'Eukanuba', 'Acana', 'Orijen'];

const SectionHeader: React.FC<{ title: string; icon: string; isExpanded: boolean; onPress: () => void }> = ({ title, icon, isExpanded, onPress }) => (
  <TouchableOpacity style={styles.sectionHeader} onPress={onPress}>
    <Text style={styles.sectionIcon}>{icon}</Text>
    <Text style={styles.sectionTitle}>{title}</Text>
    <Text style={[styles.chevron, isExpanded && styles.chevronOpen]}>{isExpanded ? '▾' : '▸'}</Text>
  </TouchableOpacity>
);

export const DrawerMenu: React.FC<DrawerMenuProps> = ({ isOpen, onClose }) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (name: string) => {
    setExpandedSections(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const handleSubCategoryPress = (category: string, sub: string) => {
    console.log(`Selected: ${category} > ${sub}`);
    onClose();
  };

  const handleBrandPress = (brand: string) => {
    console.log(`Selected brand: ${brand}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.overlayBg} onPress={onClose} activeOpacity={1} />
      <View style={styles.drawer}>
        <View style={styles.drawerHeader}>
          <Text style={styles.drawerTitle}>Categorías</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {categories.map((cat) => (
            <View key={cat.name} style={styles.categorySection}>
              <SectionHeader
                title={cat.name}
                icon={cat.icon}
                isExpanded={!!expandedSections[cat.name]}
                onPress={() => toggleSection(cat.name)}
              />
              {expandedSections[cat.name] && (
                <View style={styles.subCategories}>
                  {cat.subCategories.map((sub) => (
                    <TouchableOpacity
                      key={sub.name}
                      style={styles.subCategoryItem}
                      onPress={() => handleSubCategoryPress(cat.name, sub.name)}
                    >
                      <Text style={styles.subCategoryText}>{sub.name}</Text>
                      {sub.count !== undefined && (
                        <Text style={styles.subCategoryCount}>({sub.count})</Text>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          ))}

          <View style={styles.categorySection}>
            <SectionHeader
              title="Marcas"
              icon="🏷️"
              isExpanded={!!expandedSections['Marcas']}
              onPress={() => toggleSection('Marcas')}
            />
            {expandedSections['Marcas'] && (
              <View style={styles.subCategories}>
                {brands.map((brand) => (
                  <TouchableOpacity
                    key={brand}
                    style={styles.subCategoryItem}
                    onPress={() => handleBrandPress(brand)}
                  >
                    <Text style={styles.subCategoryText}>{brand}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
    flexDirection: 'row',
  },
  overlayBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  drawer: {
    width: '70%',
    height: '100%',
    backgroundColor: colors.white,
    paddingTop: 50,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  drawerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: colors.textSecondary,
  },
  scrollContent: {
    flex: 1,
  },
  categorySection: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  sectionIcon: {
    fontSize: 20,
  },
  sectionTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  chevron: {
    fontSize: 14,
    color: colors.gray,
  },
  chevronOpen: {
    transform: [{ rotate: '90deg' }],
  },
  subCategories: {
    paddingLeft: 52,
    paddingRight: 20,
    paddingBottom: 8,
    backgroundColor: colors.background,
  },
  subCategoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  subCategoryText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  subCategoryCount: {
    fontSize: 13,
    color: colors.gray,
  },
});
