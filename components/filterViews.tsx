import { theme } from "@/constants/theme"
import { capitalize, hp } from "@/helpers/common"
import { Pressable, StyleSheet, Text, View } from "react-native"

export const SectionView = ({ title, content }: { title: string, content: any }) => {
    return (
        <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <View>
                {content}
            </View>
        </View>
    )
}

export const CommonFilterRow = ({ data, filters, setFilters, filterName }: { data: any, filters: any, setFilters: any, filterName: string }) => {
    const onSelect = (item: any) => {
        setFilters({ ...filters, [filterName]: item });
    }
    return (
        <View style={styles.flexRowWrap}>
            {
                data && data.map((item: any) => {
                    let isActive = filters && filters[filterName] == item;
                    let backgroundColor = isActive ? theme.colors.neutral(0.7) : "white";
                    let color = isActive ? "white" : theme.colors.neutral(0.7);
                    return (
                        <Pressable key={item} style={[styles.outlinedButton, { backgroundColor }]} onPress={() => onSelect(item)}>
                            <Text style={[styles.outlinedButtonText, { color }]}>{capitalize(item)}</Text>
                        </Pressable>
                    )
                })
            }
        </View>
    )
}
export const ColorFilter = ({ data, filters, setFilters, filterName }: { data: any, filters: any, setFilters: any, filterName: string }) => {
    const onSelect = (item: any) => {
        setFilters({ ...filters, [filterName]: item });
    }
    return (
        <View style={styles.flexRowWrap}>
            {
                data && data.map((item: any) => {
                    let isActive = filters && filters[filterName] == item;
                    let borderColor = isActive ? theme.colors.neutral(0.4) : "white";
                    return (
                        <Pressable key={item} onPress={() => onSelect(item)}>
                            <View style={[styles.colorWrapper, { borderColor }]} >
                                <View style={[styles.color, { backgroundColor: item }]} />
                            </View>
                        </Pressable>
                    )
                })
            }
        </View>
    )
}



const styles = StyleSheet.create({
    sectionContainer: {
        gap: 8,
    },
    sectionTitle: {
        fontSize: hp(2.4),
        fontWeight: theme.fontWeights.medium,
        color: theme.colors.neutral(0.8),
    },
    flexRowWrap: {
        gap: 10,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    outlinedButton: {
        padding: 8,
        paddingHorizontal: 14,
        borderWidth: 1,
        borderColor: theme.colors.grayBG,
        borderRadius: theme.radius.xs,
        borderCurve: 'continuous',
    },
    colorWrapper: {
        padding: 3,
        borderRadius: theme.radius.sm,
        borderWidth: 2,
        borderCurve: 'continuous',
    },
    color: {
        height: 30,
        width: 40,
        borderRadius: theme.radius.sm - 3,
        borderCurve: 'continuous',
    },
})
