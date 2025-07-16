import { getColumnCount, wp } from '@/helpers/common'
import { MasonryFlashList } from '@shopify/flash-list'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import ImageCard from './imageCard'

const ImageGrid = ({ images, router }: { images: any[], router: any }) => {

    const columns = getColumnCount()
    return (
        <View style={styles.container}>
            <MasonryFlashList
                data={images}
                numColumns={columns}
                initialNumToRender={1000}
                contentContainerStyle={styles.listContainerStyle}
                renderItem={({ item, index }) => (
                    <ImageCard item={item} columns={columns} index={index} router={router} />
                )}
                estimatedItemSize={200}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        minHeight: 3,
        width: wp(100),
    },
    listContainerStyle: {
        paddingHorizontal: wp(4),
    }
})

export default ImageGrid