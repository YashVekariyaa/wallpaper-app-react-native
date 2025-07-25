import data from '@/constants/data';
import { theme } from '@/constants/theme';
import { capitalize, hp } from '@/helpers/common';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { BlurView } from 'expo-blur';
import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { Extrapolation, FadeInDown, interpolate, useAnimatedStyle } from 'react-native-reanimated';
import { ColorFilter, CommonFilterRow, SectionView } from './filterViews';

const FiltersModal = ({ modalRef, filters, setFilters, onClose, onApply, onReset }: { modalRef: React.RefObject<BottomSheetModal>, filters: any, setFilters: any, onClose: any, onApply: any, onReset: any }) => {

    const snapPoints = useMemo(() => ['75%'], []);
    
    return (
        <BottomSheetModal
            ref={modalRef}
            index={0}
            snapPoints={snapPoints}
            enablePanDownToClose={true}
            backdropComponent={CustomBackDrop}
        >
            <BottomSheetView style={styles.contentContainer}>
                <View style={styles.content}>
                    <Text style={styles.filterText}>Filters</Text>
                    {
                        Object.keys(sections).map((sectionName, index) => {
                            let sectionView: any = sections[sectionName]
                            let sectionData: any = data.filters[sectionName]
                            let title: any = capitalize(sectionName)
                            return (
                                <Animated.View key={sectionName} entering={FadeInDown.delay((index * 100) + 100).springify().damping(11)}>
                                    <SectionView title={title} content={sectionView({data: sectionData, filters, setFilters, filterName: sectionName})} />
                                </Animated.View>
                            )
                        })
                    }

                    {/* actions  */}
                    <Animated.View style={styles.buttons} entering={FadeInDown.delay(500).springify().damping(11)}>
                        <Pressable style={styles.resetButton} onPress={onReset}>
                            <Text style={[styles.buttonText, { color: theme.colors.neutral(0.9) }]}>Reset</Text>
                        </Pressable>
                        <Pressable style={styles.applyButton} onPress={onApply}>
                            <Text style={[styles.buttonText, { color: theme.colors.white }]}>Apply</Text>
                        </Pressable>
                    </Animated.View>
                </View>
            </BottomSheetView>
        </BottomSheetModal>
    )
}

const sections: any = {
    "order": (props: any) => <CommonFilterRow {...props} />,
    "orientation": (props: any) => <CommonFilterRow {...props} />,
    "type": (props: any) => <CommonFilterRow {...props} />,
    "colors": (props: any) => <ColorFilter {...props} />
}


const CustomBackDrop = ({ animatedIndex, style }: { animatedIndex: any, style: any }) => {

    const containerAnimatedStyle = useAnimatedStyle(() => {
        let opacity = interpolate(animatedIndex.value, [-1, 0], [0, 1], Extrapolation.CLAMP);
        return {
            opacity
        }
    });

    const containerStyle = [
        StyleSheet.absoluteFill,
        style,
        styles.overlay,
        containerAnimatedStyle
    ];

    return (
        <Animated.View style={containerStyle} >
            <BlurView
                style={StyleSheet.absoluteFill}
                tint='dark'
                intensity={25}
            />
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        alignItems: 'center',
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    content: {
        flex: 1,
        // width: '100%',
        gap: 15,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    filterText: {
        fontSize: hp(4),
        fontWeight: theme.fontWeights.semibold,
        color: theme.colors.neutral(0.8),
        marginBottom: 5,
    },
    buttons: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginTop: 10,
    },
    applyButton: {
        flex: 1,
        backgroundColor: theme.colors.neutral(0.8),
        padding: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: theme.radius.md,
        borderCurve: 'continuous',
    },
    resetButton: {
        flex: 1,
        backgroundColor: theme.colors.neutral(0.03),
        padding: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: theme.radius.md,
        borderCurve: 'continuous',
        borderWidth: 2,
        borderColor: theme.colors.grayBG,
    },
    buttonText: {
        fontSize: hp(2.2),
    },
})

export default FiltersModal