class UserService {

     getObjectFromLocalstorage(key, default_value){
        const value = localStorage.getItem(key);
        if (value === null){
            return default_value;
        }
        return JSON.parse(value);
    }

    getFavorites() {
        return this.getObjectFromLocalstorage("favorites", []);
    }

    isFavorite(instance) {
        return this.getFavorites().find(item => item.identifier === instance.identifier) !== undefined;
    }

    toggleFavorite(instance) {
        /*
        We now store it in the local storage but this might be changed in the future.
         */
        let favorites = this.getFavorites();
        if (this.isFavorite(instance)) {
            favorites = favorites.filter(item => item.identifier !== instance.identifier);
        } else {
            favorites.push(instance);
        }

        localStorage.setItem("favorites", JSON.stringify(favorites));
    }
}

export default new UserService();