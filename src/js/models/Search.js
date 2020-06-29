import axios from 'axios';
//import proxy from '../config'

export default class Search {
    constructor(query){
        this.query = query;
    }

    async getResults() {
        try {
            const res = await axios(`https://forkify-api.herokuapp.com/api/search?q=${this.query}`);
            this.result = res.data.recipes;  //saves this property to the object itself which is stored in its prototype
            //console.log(this.result);
        } catch(error) {
            alert(error)
        }
    }
}