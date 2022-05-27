

export class ImageClass {
    public name: string[];
    public url: string;
    public id: string;
    
    constructor(name: string[], url: string) {
        this.name = name;
        this.url = url;
    }
}

export const ImageConverter = {
    toFirestore: (a : ImageClass) => {
        return {
            name : a.name,
            url : a.url
        }
        
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new ImageClass(data.name, data.url);
    }
};