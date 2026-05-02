import React, { useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { colors } from "../../theme/colors";

interface FilterMenuProps {
  onApply: (filters: FilterState) => void;
}

export interface FilterState {
  priceMin: number;
  priceMax: number;
  brands: string[];
  categories: string[];
  pets: string[];
}

const mockBrands = [
  "Royal Canin",
  "Purina",
  "Pedigree",
  "Whiskas",
  "Pro Plan",
  "Hill's",
  "Eukanuba",
];
const mockCategories = [
  "Alimento",
  "Juguetes",
  "Higiene",
  "Salud",
  "Accesorios",
  "Camas",
];
const mockPets = ["Perro", "Gato", "Pez", "Ave"];

const THUMB_SIZE = 22;
const THUMB_RADIUS = THUMB_SIZE / 2;

type AccordionSectionType = "price" | "brands" | "category" | "pets" | null;

interface AccordionSectionProps {
  title: string;
  isOpen: boolean;
  onPress: () => void;
  children: React.ReactNode;
}

const AccordionSection: React.FC<AccordionSectionProps> = ({
  title,
  isOpen,
  onPress,
  children,
}) => {
  return (
    <View style={styles.section}>
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={[styles.chevron, isOpen && styles.chevronOpen]}>
          ▾
        </Text>
      </TouchableOpacity>
      {isOpen && <View style={styles.sectionContent}>{children}</View>}
    </View>
  );
};

export const FilterMenu: React.FC<FilterMenuProps> = ({ onApply }) => {
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(100);
  const [brands, setBrands] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [pets, setPets] = useState<string[]>([]);
  const [activeSection, setActiveSection] = useState<AccordionSectionType>(null);

  const trackRef = useRef<View>(null);
  const trackPos = useRef(0);
  const trackW = useRef(0);
  const dragRef = useRef<"min" | "max" | null>(null);

  const toggleOption = useCallback(
    (
      list: string[],
      setList: React.Dispatch<React.SetStateAction<string[]>>,
      option: string,
    ) => {
      setList((prev) =>
        prev.includes(option)
          ? prev.filter((o) => o !== option)
          : [...prev, option],
      );
    },
    [],
  );

  const handleApply = () => {
    onApply({ priceMin, priceMax, brands, categories, pets });
  };

  const handleReset = () => {
    setPriceMin(0);
    setPriceMax(100);
    setBrands([]);
    setCategories([]);
    setPets([]);
  };

  const toggleSection = (section: AccordionSectionType) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const valFromX = useCallback((pageX: number) => {
    const ratio = Math.max(
      0,
      Math.min(1, (pageX - trackPos.current) / trackW.current),
    );
    return Math.round(ratio * 100);
  }, []);

  const onStart = useCallback(
    (e: any) => {
      const v = valFromX(e.nativeEvent.pageX);
      const dMin = Math.abs(v - priceMin);
      const dMax = Math.abs(v - priceMax);
      if (dMin <= dMax) {
        dragRef.current = "min";
        setPriceMin(Math.min(v, priceMax));
      } else {
        dragRef.current = "max";
        setPriceMax(Math.max(v, priceMin));
      }
    },
    [priceMin, priceMax, valFromX],
  );

  const onMove = useCallback(
    (e: any) => {
      if (!dragRef.current) return;
      const v = valFromX(e.nativeEvent.pageX);
      if (dragRef.current === "min") {
        setPriceMin(Math.min(v, priceMax));
      } else {
        setPriceMax(Math.max(v, priceMin));
      }
    },
    [priceMax, priceMin, valFromX],
  );

  const onEnd = useCallback(() => {
    dragRef.current = null;
  }, []);

  const measureTrack = useCallback(() => {
    trackRef.current?.measureInWindow((x, _y, w, _h) => {
      trackPos.current = x;
      trackW.current = w;
    });
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <AccordionSection
          title="Precio"
          isOpen={activeSection === "price"}
          onPress={() => toggleSection("price")}
        >
          <Text style={styles.priceLabel}>
            S/{priceMin} - S/{priceMax}
          </Text>
          <View
            ref={trackRef}
            style={styles.sliderTrack}
            onLayout={measureTrack}
            onTouchStart={onStart}
            onTouchMove={onMove}
            onTouchEnd={onEnd}
            onTouchCancel={onEnd}
          >
            <View style={styles.sliderBackground} />
            <View
              style={[
                styles.sliderFill,
                {
                  left: `${priceMin}%`,
                  right: `${100 - priceMax}%`,
                },
              ]}
            />
            <View
              style={[styles.thumb, { left: `${priceMin}%` }]}
              pointerEvents="none"
            />
            <View
              style={[styles.thumb, { left: `${priceMax}%` }]}
              pointerEvents="none"
            />
          </View>
        </AccordionSection>

        <AccordionSection
          title="Marcas"
          isOpen={activeSection === "brands"}
          onPress={() => toggleSection("brands")}
        >
          <View style={styles.tagRow}>
            {mockBrands.map((option) => {
              const isActive = brands.includes(option);
              return (
                <TouchableOpacity
                  key={option}
                  style={[styles.tag, isActive && styles.tagActive]}
                  onPress={() => toggleOption(brands, setBrands, option)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[styles.tagText, isActive && styles.tagTextActive]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </AccordionSection>

        <AccordionSection
          title="Categoría"
          isOpen={activeSection === "category"}
          onPress={() => toggleSection("category")}
        >
          <View style={styles.tagRow}>
            {mockCategories.map((option) => {
              const isActive = categories.includes(option);
              return (
                <TouchableOpacity
                  key={option}
                  style={[styles.tag, isActive && styles.tagActive]}
                  onPress={() => toggleOption(categories, setCategories, option)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[styles.tagText, isActive && styles.tagTextActive]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </AccordionSection>

        <AccordionSection
          title="Mascota"
          isOpen={activeSection === "pets"}
          onPress={() => toggleSection("pets")}
        >
          <View style={styles.tagRow}>
            {mockPets.map((option) => {
              const isActive = pets.includes(option);
              return (
                <TouchableOpacity
                  key={option}
                  style={[styles.tag, isActive && styles.tagActive]}
                  onPress={() => toggleOption(pets, setPets, option)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[styles.tagText, isActive && styles.tagTextActive]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </AccordionSection>
      </ScrollView>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.resetButtonText}>Limpiar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
          <Text style={styles.applyButtonText}>Aplicar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    maxHeight: 400,
  },
  section: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: 4,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  chevron: {
    fontSize: 16,
    color: colors.gray,
  },
  chevronOpen: {
    transform: [{ rotate: "180deg" }],
  },
  sectionContent: {
    paddingBottom: 16,
  },
  priceLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary,
    marginBottom: 12,
  },
  sliderTrack: {
    height: 24,
    marginHorizontal: 12,
    position: "relative",
    justifyContent: "center",
  },
  sliderBackground: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 4,
    top: 10,
    backgroundColor: colors.grayLight,
    borderRadius: 2,
  },
  sliderFill: {
    position: "absolute",
    top: 10,
    height: 4,
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  thumb: {
    position: "absolute",
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_RADIUS,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.primary,
    top: 1,
    marginLeft: -THUMB_RADIUS,
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  tagActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tagText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  tagTextActive: {
    color: colors.white,
    fontWeight: "600",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
    paddingTop: 12,
  },
  resetButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  applyButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: "center",
  },
  applyButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.white,
  },
});
