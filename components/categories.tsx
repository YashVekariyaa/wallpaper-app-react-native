import data from '@/constants/data'
import { theme } from '@/constants/theme'
import { hp, wp } from '@/helpers/common'
import React from 'react'
import { FlatList, Pressable, StyleSheet, Text } from 'react-native'
import Animated, { FadeInRight } from 'react-native-reanimated'

const Categories = ({ activeCategory, handleChangeCategory }: { activeCategory: string | null, handleChangeCategory: (category: any) => void }) => {
    return (
        <FlatList
            horizontal
            contentContainerStyle={styles.flatlistContainer}
            showsHorizontalScrollIndicator={false}
            data={data.categories}
            keyExtractor={(item) => item}
            renderItem={({ item, index }) => (
                <CategoryItem isActive={activeCategory === item} handleChangeCategory={handleChangeCategory} title={item} index={index} />
            )}
        />
    )
}

const CategoryItem = ({ isActive, handleChangeCategory, title, index }: { isActive: boolean, handleChangeCategory: (category: string) => void, title: string, index: number }) => {
    let color = isActive ? theme.colors.white : theme.colors.neutral(0.9)
    let backgroundColor = isActive ? theme.colors.neutral(0.9) : theme.colors.white
    return (
        <Animated.View entering={FadeInRight.delay(index * 200).duration(1000).springify().damping(14)}>
            <Pressable onPress={() => handleChangeCategory(isActive ? null : title)}
                style={[styles.category, { backgroundColor }]}>
                <Text style={[styles.categoryText, { color }]}>{title}</Text>
            </Pressable>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    flatlistContainer: {
        paddingHorizontal: wp(4),
        gap: 8,
    },
    category: {
        padding: 12,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: theme.colors.grayBG,
        borderRadius: theme.radius.lg,
        borderCurve: "continuous",
    },
    categoryText: {
        fontSize: hp(1.8),
        fontWeight: theme.fontWeights.medium,
        color: theme.colors.neutral(0.9),
    }
})

export default Categories