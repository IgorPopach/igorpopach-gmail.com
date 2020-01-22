import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { ActionCreator } from 'redux';

import {
    RegistrationStarts,
    RegistrationFinished,
    StoreUser,
    InitializeSessionStarts,
    InitializeSessionFinished,
    TYPES,
} from './types';
import firebase from '../../firebase';
import { User } from '../../types/User';

type RegistrationEpic = (login: string, password: string) => ThunkAction<
    Promise<{ isSuccessful: boolean }>, // What should action return 
    {}, // TODO: get Application state type;
    undefined, // extra arguments (from middleware)
    RegistrationStarts | RegistrationFinished // TODO: add error action
>;

type InitializeSessionEpic = () => ThunkAction<
    void, 
    {},
    undefined,
    InitializeSessionStarts | InitializeSessionFinished | StoreUser // TODO: add error action
>;
const INITIALIZATION_STARTS_ACTION = { type: TYPES.INITIALIZATION_STARTS };
const INITIALIZATION_FINISHED_ACTION = { type: TYPES.INITIALIZATION_FINISHED };
const REGISTRATION_STARTS_ACTION = { type: TYPES.REGISTRATION_STARTS };
const REGISTRATION_FINISHED_ACTION = { type: TYPES.REGISTRATION_FINISHED };

export const storeUser = (payload: User|null) => ({
    type: TYPES.STORE_USER,
    payload,
});

function onSignIn(
    dispatch: ThunkDispatch<{}, undefined, InitializeSessionStarts | InitializeSessionFinished | StoreUser>,
    { displayName, uid, email, photoURL}: firebase.User,
) {
    dispatch(storeUser({ displayName, uid, email, photoURL,}));
}

function onSignOut(
    dispatch: ThunkDispatch<{}, undefined, InitializeSessionStarts | InitializeSessionFinished | StoreUser>
) {
    dispatch(storeUser(null));
}

export const initializeSession: InitializeSessionEpic = () => (dispatch) => {
    dispatch(INITIALIZATION_STARTS_ACTION);
    firebase
        .auth()
        .onAuthStateChanged((user) => {
            if (user) {
                onSignIn(dispatch, user);
            } else {
                onSignOut(dispatch);
            }
            dispatch(INITIALIZATION_FINISHED_ACTION)
        });
};

export const registerNewUser: RegistrationEpic = (login: string, password: string) => (
    dispatch
): Promise<{isSuccessful: boolean }> => {
    dispatch(REGISTRATION_STARTS_ACTION);
    return firebase
        .auth()
        .createUserWithEmailAndPassword(login, password)
        .then(() => {
            dispatch(REGISTRATION_FINISHED_ACTION);
            return { isSuccessful: true };
        })
        .catch(({ code, message, ...errorsRest }) => {
            console.log({ code, message, errorsRest });
            // TODO: display error in Global errors
            dispatch(REGISTRATION_FINISHED_ACTION);
            return { isSuccessful: false };
        });
};
