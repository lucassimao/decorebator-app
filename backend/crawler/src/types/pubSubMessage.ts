export interface PubSubMessage{
    messageId:string;
    data:string;
    attributes: {[key : string] : string}
}