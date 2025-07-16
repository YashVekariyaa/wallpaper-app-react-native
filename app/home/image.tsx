import { theme } from '@/constants/theme';
import { hp, wp } from '@/helpers/common';
import { Entypo, Octicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as FileSystem from 'expo-file-system';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Animated, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { FadeInDown } from 'react-native-reanimated';
import Toast from 'react-native-toast-message';

const ImageScreen = () => {
    const router = useRouter()
    const item = useLocalSearchParams()
    const [status, setStatus] = useState('loading')
    let uri = item?.webformatURL
    const fileName = item?.previewURL?.split('/').pop()
    const imageUrl = uri as string
    const filePath = `${FileSystem.documentDirectory}${fileName}`

    const getSize = () => {
        const aspectRatio = Number(item?.imageWidth) / Number(item?.imageHeight)
        const maxWidth = Platform.OS == 'web' ? wp(50) : wp(92)
        let calculatedHeight = maxWidth / aspectRatio
        let calculatedWidth = maxWidth

        if (aspectRatio < 1) {
            calculatedWidth = calculatedWidth * aspectRatio
        }
        return { width: calculatedWidth, height: calculatedHeight }
    }

    const onLoad = () => {
        setStatus('')
    }

    const handleDownloadImage = async () => {
        if (Platform.OS == 'web') {
            const anchor = document.createElement('a');
            anchor.href = imageUrl;
            anchor.target = "_blank";
            anchor.download = fileName || "download";
            document.body.appendChild(anchor);
            anchor.click();
            document.body.removeChild(anchor);
        } else {
            setStatus('downloading')
            let url = await downloadFile();
            if (url) {
                showToast("Image downloaded")
            }
        }
    }

    const handleShareImage = async () => {
        if (Platform.OS == 'web') {
            showToast("Link Copied")
        } else {
            setStatus('sharing')
            let url = await downloadFile();
            if (url) {
                await Sharing.shareAsync(url)
            }
        }
    }

    const downloadFile = async () => {
        try {
            const { uri } = await FileSystem.downloadAsync(imageUrl, filePath)
            setStatus('')
            return uri
        } catch (error) {
            console.log("error", error)
            setStatus('')
            Alert.alert('Image', error.message)
            return null
        }
    }

    const showToast = (message: string) => {
        Toast.show({
            type: "success",
            text1: message,
            position: "bottom",
        });
    }

    const toastConfig = {
        success: ({ text1, props, ...rest }: { text1: string, props: { message: string }, rest: any }) => {
            return (
                <View style={styles.toast}>
                    <Text style={styles.toastText}>{text1}</Text>
                </View>
            )
        }
    }

    return (
        <BlurView style={styles.container} tint='dark' intensity={60}>
            <View style={getSize()}>
                <View style={styles.loading}>
                    {
                        status == 'loading' && <ActivityIndicator size='large' color="white" />
                    }
                </View>
                <Image transition={100} style={[styles.image, getSize()]} source={uri} onLoad={onLoad} />
            </View>
            <View style={styles.buttons}>
                <Animated.View entering={FadeInDown.springify()}>
                    <Pressable style={styles.button} onPress={() => router.back()}>
                        <Octicons name='x' size={24} color='white' />
                    </Pressable>
                </Animated.View>
                <Animated.View entering={FadeInDown.springify().delay(100)}>
                    {
                        status == "downloading" ?
                            <View style={styles.button}>
                                <ActivityIndicator size='small' color='white' />
                            </View> :
                            <Pressable style={styles.button} onPress={handleDownloadImage}>
                                <Octicons name='download' size={24} color='white' />
                            </Pressable>
                    }
                </Animated.View>
                <Animated.View entering={FadeInDown.springify().delay(200)}>
                    {
                        status == "sharing" ?
                            <View style={styles.button}>
                                <ActivityIndicator size='small' color='white' />
                            </View> :
                            <Pressable style={styles.button} onPress={handleShareImage}>
                                <Entypo name='share' size={22} color='white' />
                            </Pressable>
                    }
                </Animated.View>
            </View>
            <Toast config={toastConfig} visibilityTime={2500} />
        </BlurView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: wp(4),
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    image: {
        borderRadius: theme.radius.lg,
        borderWidth: 2,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderColor: 'rgba(255,255,255,0.1)',
    },
    loading: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttons: {
        marginTop: 40,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 50,
    },
    button: {
        height: hp(6),
        width: hp(6),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: theme.radius.lg,
        borderCurve: 'continuous',
    },
    toast: {
        padding: 15,
        paddingHorizontal: 30,
        borderRadius: theme.radius.xl,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.15)',
    },
    toastText: {
        fontSize: hp(1.8),
        fontWeight: theme.fontWeights.semibold,
        color: theme.colors.white,
    }
})

export default ImageScreen