import { getImages } from '@/api';
import Categories from '@/components/categories';
import FiltersModal from '@/components/filtersModal';
import ImageGrid from '@/components/imageGrid';
import { theme } from '@/constants/theme';
import { hp, wp } from '@/helpers/common';
import { Feather, FontAwesome6, Ionicons } from '@expo/vector-icons';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

var page = 1
const HomeScreen = () => {
    const router = useRouter();
    const { top } = useSafeAreaInsets();
    const paddingTop = top > 0 ? top + 10 : 30;
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [images, setImages] = useState<any[]>([]);
    const [filters, setFilters] = useState<any>({});
    const searchRef = useRef<TextInput>(null);
    const modalRef = useRef<BottomSheetModal>(null);
    const scrollRef = useRef<ScrollView>(null);
    const [isEndReached, setIsEndReached] = useState(false);

    useEffect(() => {
        fetchImages()
    }, [])

    const fetchImages = async (params = { page: 1 }, append = true) => {
        let res = await getImages(params)
        if (res?.success && res?.data?.hits) {
            if (append) {
                setImages([...images, ...res.data.hits])
            } else {
                setImages([...res.data.hits])
            }
        }
    }

    const openFiltersModal = () => {
        modalRef.current?.present()
    }

    const closeFiltersModal = () => {
        modalRef.current?.close()
    }

    const applyFilters = () => {
        if (filters) {
            page = 1
            setImages([])
            let params = {
                page,
                ...filters
            }
            if (activeCategory) params.category = activeCategory
            if (search) params.q = search
            fetchImages(params, false)
        }
        closeFiltersModal()
    }

    const resetFilters = () => {
        if (filters) {
            page = 1
            setFilters(null)
            setImages([])
            let params = {
                page,
            }
            if (activeCategory) params.category = activeCategory
            if (search) params.q = search
            fetchImages(params, false)
        }
        closeFiltersModal()
    }

    const clearThisFilter = (filterName: string) => {
        let filterz = { ...filters }
        delete filterz[filterName]
        setFilters({ ...filterz })
        page = 1
        setImages([])
        let params = { page, ...filterz }
        if (activeCategory) params.category = activeCategory
        if (search) params.q = search
        fetchImages(params, false)
    }

    const handleChangeCategory = (category: string) => {
        setActiveCategory(category);
        clearSearch();
        setImages([])
        page = 1
        let params = { page, ...filters }
        if (category) params.category = category
        fetchImages(params, false)
    }

    const handleSearch = (val: string) => {
        setSearch(val)
        if (val.length > 2) {
            page = 1
            setImages([])
            fetchImages({ page })
            setActiveCategory(null)
            fetchImages({ page: 1, q: val, ...filters }, false)
        }

        if (val == "") {
            page = 1
            searchRef.current?.clear()
            setImages([])
            setActiveCategory(null)
            fetchImages({ page, ...filters }, false)
        }
    }

    const clearSearch = () => {
        setSearch("")
        searchRef.current?.clear()
    }

    const handleScrollUp = () => {
        scrollRef.current?.scrollTo({ y: 0, animated: true })
    }

    const handleScroll = (event: any) => {
        const contentHeight = event.nativeEvent.contentSize.height
        const scrollViewHeight = event.nativeEvent.layoutMeasurement.height
        const scrollOffset = event.nativeEvent.contentOffset.y
        const bottomPosition = contentHeight - scrollViewHeight

        if (scrollOffset >= bottomPosition - 1) {
            if (!isEndReached) {
                setIsEndReached(true)
                ++page;
                let params = { page, ...filters }
                if (activeCategory) params.category = activeCategory
                if (search) params.q = search
                fetchImages(params)
            }
        } else if (isEndReached) {
            setIsEndReached(false)
        }
    }

    const handleTextDebounce = useCallback(debounce(handleSearch, 400), [])

    return (
        <View style={[styles.container, { paddingTop }]}>
            <View style={styles.header}>
                <Pressable onPress={handleScrollUp}>
                    <Text style={styles.title}>Pixels</Text>
                </Pressable>
                <Pressable onPress={openFiltersModal}>
                    <FontAwesome6 name='bars-staggered' size={22} color={theme.colors.neutral(0.7)} />
                </Pressable>
            </View>
            <ScrollView onScroll={handleScroll} scrollEventThrottle={5} ref={scrollRef} contentContainerStyle={{ gap: 15 }}>
                <View style={styles.searchBar}>
                    <View style={styles.searchIcon}>
                        <Feather name='search' size={24} color={theme.colors.neutral(0.4)} />
                    </View>
                    <TextInput
                        placeholder='Search For Photos...'
                        style={styles.searchInput}
                        onChangeText={handleTextDebounce}
                        ref={searchRef}
                    />
                    {
                        search && (
                            <Pressable onPress={() => handleSearch("")} style={styles.closeIcon}>
                                <Ionicons name='close' size={24} color={theme.colors.neutral(0.6)} />
                            </Pressable>
                        )
                    }
                </View>

                {/* categories  */}
                <View>
                    <Categories activeCategory={activeCategory} handleChangeCategory={handleChangeCategory} />
                </View>

                {/* filters  */}
                {
                    filters && Object.keys(filters).length > 0 && (
                        <View>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
                                {
                                    Object.keys(filters).map((key, index) => (
                                        <View key={index} style={styles.filterItem}>
                                            {
                                                key == "colors" ? (
                                                    <View style={{ height: 20, width: 30, borderRadius: 7, backgroundColor: filters[key] }} />
                                                ) : (
                                                    <Text style={styles.filterItemText}>{filters[key]}</Text>
                                                )
                                            }
                                            <Pressable style={styles.filterCloseIcon} onPress={() => clearThisFilter(key)}>
                                                <Ionicons name='close' size={14} color={theme.colors.neutral(0.9)} />
                                            </Pressable>
                                        </View>
                                    ))
                                }
                            </ScrollView>
                        </View>
                    )
                }

                {/* images Grid */}
                <View>
                    {
                        images?.length > 0 && (
                            <ImageGrid images={images} router={router} />
                        )
                    }
                </View>


                {/* loading  */}
                <View style={{ marginBottom: 70, marginTop: images?.length > 0 ? 10 : 70 }}>
                    <ActivityIndicator size='large' />
                </View>
            </ScrollView>

            <FiltersModal modalRef={modalRef} filters={filters} setFilters={setFilters} onClose={closeFiltersModal} onApply={applyFilters} onReset={resetFilters} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 15,
    },
    header: {
        marginHorizontal: wp(4),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: hp(4),
        fontWeight: theme.fontWeights.semibold,
        color: theme.colors.neutral(0.9),
    },
    searchBar: {
        marginHorizontal: wp(4),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.grayBG,
        backgroundColor: theme.colors.white,
        padding: 6,
        paddingLeft: 10,
        borderRadius: theme.radius.lg,
    },
    searchIcon: {
        padding: 8,
    },
    searchInput: {
        flex: 1,
        borderRadius: theme.radius.lg,
        paddingVertical: 10,
        fontSize: hp(1.8),
    },
    closeIcon: {
        backgroundColor: theme.colors.neutral(0.1),
        padding: 8,
        borderRadius: theme.radius.sm,
    },
    filters: {
        paddingHorizontal: wp(4),
        gap: 10,
    },
    filterItem: {
        backgroundColor: theme.colors.grayBG,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: theme.radius.xs,
        padding: 8,
        gap: 10,
        paddingHorizontal: 10,
    },
    filterItemText: {
        fontSize: hp(1.9),
    },
    filterCloseIcon: {
        backgroundColor: theme.colors.neutral(0.2),
        padding: 4,
        borderRadius: 7,
    }

})

export default HomeScreen