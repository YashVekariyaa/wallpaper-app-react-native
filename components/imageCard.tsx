import { theme } from '@/constants/theme'
import { getImageSize, wp } from '@/helpers/common'
import { Image } from 'expo-image'
import React from 'react'
import { Pressable, StyleSheet } from 'react-native'

const ImageCard = ({ item, columns, index, router }: { item: any, columns: number, index: number, router: any }) => {
   
    const isLastInRow = () => {
        return (index + 1) % columns === 0
    }

    const getImageHeight = () => {
        let { imageHeight: height, imageWidth: width } = item
        return { height: getImageSize(height, width) }
    }
    return (
        <Pressable onPress={() => router.push({ pathname: '/home/image', params: { ...item } })} style={[styles.imageWrapper, !isLastInRow() && styles.spacing]}>
            <Image
                style={[styles.image, getImageHeight()]}
                source={{ uri: item.webformatURL }}
                transition={100}
            />
        </Pressable>
    )
}

const styles = StyleSheet.create({
    image: {
        height: 300,
        width: "100%",
    },
    imageWrapper: {
        backgroundColor: theme.colors.grayBG,
        borderRadius: theme.radius.xl,
        borderCurve: "continuous",
        overflow: "hidden",
        marginBottom: wp(2)
    },
    spacing: {
        marginRight: wp(2)
    }
})
export default ImageCard