export class Product{
    private title_: string;
    private price_: number = 0;
    public image_url: string;
    public description: string;

    constructor(title: string, price: number, image_url: string, description: string){
        this.title_ = title;
        this.price_ = price;
        this.description = description;
        this.image_url = image_url;
    }

    
    public get title() : string {
        return this.title_;
    }
    
    public set title(title : string) {
        this.title_ = title;
    }

    
    public get price() : number {
        return this.price_;
    }
    

    public set price(price : number) {
        this.price_ = price;
    }

    

    
    
    
    
}