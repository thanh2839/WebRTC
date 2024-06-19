let localStream;
let remoteStream;

const ICEservers = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        // Add other STUN servers if needed
      ]
}


let init = async () => {
    localStream = await navigator.mediaDevices.getUserMedia({video: true, audio: false})
    document.getElementById('user-1').srcObject = localStream

    createOffer()
}

let createOffer = async () => {
    peerConnection = new RTCPeerConnection(ICEservers)

    remoteStream = new MediaStream()
    document.getElementById('user-2').srcObject = remoteStream
    
    //local stream take data
    localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream)
    });
    //client stream take data
    peerConnection.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track) => {
            remoteStream.addTrack(track)
            // remoteStream.addTrack()
        })
    }

    peerConnection.onicecandidate = async (event) => {
        if(event.candidate) {
            console.log('New IceCandidate:' , event.candidate)
        }
    }
    // peerConnection.iceServers = async (event) => {
    //     if(event.cand)
    // }

    let offer = await peerConnection.createOffer()
    await peerConnection.setLocalDescription(offer)

    console.log('Offer:' ,offer)
}


init()