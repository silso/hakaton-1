export class TileData {
    id:number;
    x:number;
    y:number;
    z:number;
    color:string;

    constructor(id: number, x: number, y: number, z: number, color?: string) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.z = z;
        this.color = color || "orange";
    }

    // getTileDataPosition() {
    //     return [this.x, this.y, this.z];
    // }

    // setTileDataPosition(x: number, y: number, z: number) {
    //     this.x = x;
    //     this.y = y;
    //     this.z = z;
    // }

    // getTileDataColor() {
    //     return this.color;
    // }

    // setTileDataColor(newColor: string) {
    //     this.color = newColor;
    // }
}