import api from "../api";

export interface ApiBanner {
    id:            number;
    title:         string;
    description:   string;
    image_url:     string;
    link_url:      null;
    status:        boolean;
    display_order: number;
}



export async function getBanners():Promise<Banner[]> {
    try{
        const {data} = await api.get("/banners");

        const tra
        
    }
}