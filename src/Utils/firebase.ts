import { Platform } from "react-native";

// Your secondary Firebase project credentials for Android...
const androidCredentials = {
    appId: '1:51738943910:android:218f1d5c6d5f3d170aaf67',
    apiKey: '',
    projectId: "fit-evo-dev",
    databaseURL: "",
    storageBucket: "",
    messagingSenderId: "",
    authDomain: "",
};

// Your secondary Firebase project credentials for iOS...
const iosCredentials = {
    appId: '1:51738943910:ios:52ca7828e8f509f70aaf67',
    apiKey: '',
    projectId: "fit-evo-dev",
    databaseURL: "",
    storageBucket: "",
    messagingSenderId: "",
    authDomain: "",
};

// Select the relevant credentials
export const credentials : any = Platform.select({
    android: androidCredentials,
    ios: iosCredentials,
});