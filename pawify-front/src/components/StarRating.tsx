import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: number;
}

export const StarRating: React.FC<StarRatingProps> = ({ rating, maxStars = 5, size = 14 }) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: maxStars }).map((_, index) => (
        <Text
          key={index}
          style={[
            styles.star,
            { fontSize: size, color: index < rating ? colors.star : colors.starEmpty },
          ]}
        >
          ★
        </Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 2,
  },
  star: {
    fontWeight: 'bold',
  },
});
