function successResponseWithData(res,data, message){
    let x = {
        data,
        message,
        status:1
    };
    res.status(200).send(x);
};

function errorResponseServer(res,message) {
    let x={
        message,
        status:0
    }
    res.status(500).send(x)
};
function errorResponseBadRequest(res,message) {
    let x={
        message,
        status:0
    }
    res.status(400).send(x)
};
function errorResponseNotFound(res,message) {
    let x={
        message,
        status:0
    }
    res.status(404).send(x)
};


function successResponseWithoutData(res,message){
    let x={
        message,
        status:1
    }
    res.status(200).send(x)
    
}

module.exports={successResponseWithData,errorResponseServer,successResponseWithoutData,errorResponseNotFound,errorResponseBadRequest}