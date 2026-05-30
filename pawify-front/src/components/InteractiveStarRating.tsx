import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

interface InteractiveStarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  size?: number;
}

export const InteractiveStarRating: React.FC<InteractiveStarRatingProps> = ({
  rating,
  onRatingChange,
  size = 32,
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handlePress = (starIndex: number) => {
    onRatingChange(starIndex + 1);
  };

  const renderStar = (index: number) => {
    const currentRating = hoverRating > 0 ? hoverRating : rating;
    const isFilled = index < currentRating;
    const starColor = index < currentRating ? colors.star : colors.starEmpty;

    return (
      <TouchableOpacity
        key={index}
        onPress={() => handlePress(index)}
        onPressIn={() => setHoverRating(index + 1)}
        onPressOut={() => setHoverRating(0)}
        style={styles.starContainer}
      >
        <Text style={[styles.star, { fontSize: size, color: starColor }]}>
          {isFilled ? '★' : '☆'}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {[0, 1, 2, 3, 4].map(renderStar)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },
  starContainer: {
    padding: 2,
  },
  star: {
    fontWeight: 'bold',
  },
});
