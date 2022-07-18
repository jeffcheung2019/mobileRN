import { RootState, store } from "@/Store";
import { showSnackbar } from "@/Store/UI/actions";
import { logout } from "@/Store/Users/actions";
// @ts-ignore
import { Auth } from "aws-amplify";
import axios, { AxiosRequestConfig } from "axios";
import InAppBrowser from "react-native-inappbrowser-reborn";
import { useSelector } from "react-redux";
import crashlytics from '@react-native-firebase/crashlytics';

export const validateEmail = (email : string) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

let showSnackbarTimeout : NodeJS.Timeout
export const triggerSnackbar = (textMsg: string, autoHidingTime = 1500) => {

    let snackBarConfig = {
        visible: true,
        textMessage: textMsg,
        autoHidingTime
    }
    const {ui} = store.getState()
    const stateSnackBarConfig = ui.snackBarConfig
    if(!stateSnackBarConfig.visible){
        clearTimeout(showSnackbarTimeout)
    }
    store.dispatch(showSnackbar(snackBarConfig))

    showSnackbarTimeout = setTimeout(() => {
        store.dispatch(showSnackbar({
            visible: false,
            textMessage: "",
            autoHidingTime
        }))
    }, autoHidingTime)
}

export const awsLogout = async() => {
    try{
        await Auth.signOut()
    }catch(err: any){    
        crashlytics().recordError(err)
    }finally{
        store.dispatch(logout())
        await InAppBrowser.closeAuth()
    }
}

export const emailUsernameHash = (email: string) => `Cognito_${email.toLowerCase()}`
