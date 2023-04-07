export class Product{
    private title_: string;
    private price_: number = 0;
    private description: string;

    constructor(title: string, price: number, description: string){
        this.title_ = title;
        this.price_ = price;
        this.description = description;
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