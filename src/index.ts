
export async function handler(event: any) {
    console.log("lambda start!!!");
    return {
        statusCode: 200,
        body: 'hello!'
    };
}