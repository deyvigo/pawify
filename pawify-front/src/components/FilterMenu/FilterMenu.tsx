import React, { useState, useCallback, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
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

interface TagGroupProps {
  title: string;
  options: string[];
  selected: string[];
  onToggle: (option: string) => void;
}

const TagGroup: React.FC<TagGroupProps> = ({
  title,
  options,
  selected,
  onToggle,
}) => {
  return (
    <View style={styles.tagGroup}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.tagRow}>
        {options.map((option) => {
          const isActive = selected.includes(option);
          return (
            <TouchableOpacity
              key={option}
              style={[styles.tag, isActive && styles.tagActive]}
              onPress={() => onToggle(option)}
              activeOpacity={0.7}
            >
              <Text style={[styles.tagText, isActive && styles.tagTextActive]}>
                {option}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

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

export const FilterMenu: React.FC<FilterMenuProps> = ({ onApply }) => {
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(100);
  const [brands, setBrands] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [pets, setPets] = useState<string[]>([]);

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
      <View style={styles.priceSection}>
        <Text style={styles.sectionTitle}>
          Precio: S/{priceMin} - S/{priceMax}
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
      </View>

      <TagGroup
        title="Marcas"
        options={mockBrands}
        selected={brands}
        onToggle={(o) => toggleOption(brands, setBrands, o)}
      />
      <TagGroup
        title="Categoría"
        options={mockCategories}
        selected={categories}
        onToggle={(o) => toggleOption(categories, setCategories, o)}
      />
      <TagGroup
        title="Mascota"
        options={mockPets}
        selected={pets}
        onToggle={(o) => toggleOption(pets, setPets, o)}
      />

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
    paddingHorizontal: 30,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  priceSection: { marginBottom: 16 },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: 10,
  },
  sliderTrack: {
    height: 24,
    marginVertical: 12,
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
  tagGroup: { marginBottom: 16 },
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
    marginTop: 8,
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
