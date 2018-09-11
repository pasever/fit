import { Subject } from "rxjs/Subject";
import { User } from './user.model';
import { AuthData } from "./auth-data.model";


export class AuthService {
    public authChange = new Subject<boolean>();
    private user: User;

    registerUser(authData: AuthData) {
        this.user = {
            email: authData.email,
            userId: Math.round(Math.random() * 10000).toString()
        };
        this.authChange.next(true);
    }

    login(authData: AuthData) {
        this.user = {
            email: authData.email,
            userId: Math.round(Math.random() * 10000).toString()
        };
        this.authChange.next(true);
    }

    getUser() {
        return { ...this.user };
    }


    logout() {
        this.user = null;
        this.authChange.next(false);
    }

    isAuth() {
        return this.user !== null;
    }
}