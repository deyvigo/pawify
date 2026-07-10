import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { useAppContext } from '../../context/AppContext';
import { capitalize, titleCase } from '../../utils/format';

interface DrawerMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const SectionHeader: React.FC<{ title: string; isExpanded: boolean; onPress: () => void }> = ({ title, isExpanded, onPress }) => (
  <TouchableOpacity style={styles.sectionHeader} onPress={onPress}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <Text style={[styles.chevron, isExpanded && styles.chevronOpen]}>{isExpanded ? '▾' : '▸'}</Text>
  </TouchableOpacity>
);

export const DrawerMenu: React.FC<DrawerMenuProps> = ({ isOpen, onClose }) => {
  const insets = useSafeAreaInsets();
  const { categories, brands, categoriesLoading, setPendingFilterParams, setActiveTab } = useAppContext();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (name: string) => {
    setExpandedSections(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const handleSubCategoryPress = (category: string, sub: string) => {
    setPendingFilterParams({ category, subCategory: sub });
    setActiveTab('catalog');
    onClose();
  };

  const handleBrandPress = (brand: string) => {
    setPendingFilterParams({ brand });
    setActiveTab('catalog');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.overlayBg} onPress={onClose} activeOpacity={1} />
      <View style={[styles.drawer, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <View style={styles.drawerHeader}>
          <Text style={styles.drawerTitle}>Categorías</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {categoriesLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Cargando...</Text>
            </View>
          ) : categories.length === 0 ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>No hay categorías</Text>
            </View>
          ) : (
            categories.map((cat) => (
              <View key={cat.id} style={styles.categorySection}>
                <SectionHeader
                  title={capitalize(cat.name)}
                  isExpanded={!!expandedSections[cat.name]}
                  onPress={() => toggleSection(cat.name)}
                />
                {expandedSections[cat.name] && (
                  <View style={styles.subCategories}>
                    {(cat.sub_categories?.length ?? 0) === 0 ? (
                      <Text style={styles.noSubText}>Sin subcategorías</Text>
                    ) : (
                      (cat.sub_categories || []).map((sub) => (
                        <TouchableOpacity
                          key={sub.id}
                          style={styles.subCategoryItem}
                          onPress={() => handleSubCategoryPress(cat.name, sub.name)}
                        >
                          <Text style={styles.subCategoryText}>{capitalize(sub.name)}</Text>
                        </TouchableOpacity>
                      ))
                    )}
                  </View>
                )}
              </View>
            ))
          )}

          <View style={styles.categorySection}>
            <SectionHeader
              title="Marcas"
              isExpanded={!!expandedSections['Marcas']}
              onPress={() => toggleSection('Marcas')}
            />
            {expandedSections['Marcas'] && (
              <View style={styles.subCategories}>
                {brands.length === 0 ? (
                  <Text style={styles.noSubText}>No hay marcas</Text>
                ) : (
                  brands.map((brand) => (
                    <TouchableOpacity
                      key={brand.id}
                      style={styles.subCategoryItem}
                      onPress={() => handleBrandPress(brand.name)}
                    >
                      <Text style={styles.subCategoryText}>{titleCase(brand.name)}</Text>
                    </TouchableOpacity>
                  ))
                )}
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
    ...StyleSheet.absoluteFill,
    zIndex: 100,
  },
  overlayBg: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  drawer: {
    width: '70%',
    height: '100%',
    backgroundColor: colors.white,
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
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
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: colors.gray,
  },
  noSubText: {
    fontSize: 13,
    color: colors.gray,
    fontStyle: 'italic',
  },
});
