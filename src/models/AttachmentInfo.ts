export default class AttachmentInfo {
    static nameOnly(name: any): AttachmentInfo {
        const info = new AttachmentInfo();
        info.name = name;
        return info;
    }
    name: string = "";
    data: Blob = new Blob();
    url: string = "";
}