export default class Likes {
    constructor(){
        this.likes = [];
    }

    addLike(id, title, author, img){
        const like = {
            id,
            title,
            author,
            img
        }
        this.likes.push(like) 

        //persist the data in localstorage
        this.persistData()

        return like;
    }

    deleteLike(id){
        const index = this.likes.findIndex(el => el.id === id);
        this.likes.splice(index, 1);

        //persist the data in localstorage
        this.persistData()
    }

    isLiked(id){
        return this.likes.findIndex(el => el.id === id) !== -1;
    }

    getNumLikes(){
        return this.likes.length;
    }

    persistData(){
        //local storage only accepts string so we convert the array into a string
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }

    readStorage() {
        //local storage only accepts string so we convert back from string to array so we can iterate the elements
        const storage = JSON.parse(localStorage.getItem('likes'));
        if(storage) {
            this.likes = storage;
        }
    }
}