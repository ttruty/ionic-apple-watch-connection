//
//  InterfaceController.swift
//  watch-sample WatchKit Extension
//
//  Created by Tim Truty on 2/9/22.
//

import WatchKit
import Foundation
import WatchConnectivity


class InterfaceController: WKInterfaceController, WCSessionDelegate  {
    @IBOutlet var sendButton: WKInterfaceButton!
    @IBOutlet var dataRecievedLabel: WKInterfaceLabel!
    var count = 0

    override func awake(withContext context: Any?) {
        if(WCSession.isSupported()){
            let session = WCSession.default
            session.delegate = self
            session.activate()
        }
    }
    
    func session(_ session: WCSession, activationDidCompleteWith activationState: WCSessionActivationState, error: Error?) {
    }
    
    func session(_ session: WCSession, didReceiveMessage message: [String : Any], replyHandler: @escaping ([String : Any]) -> Void) {
        print(message["message"])
        let messageString = message["message"] as? [String]
        print(messageString)
        dataRecievedLabel.setText(messageString![1])
    }
    
    @IBAction func sendData() {
        count += 1
        if(WCSession.default.isReachable) {
            let message = ["message" : "\(count) messages from watch"]
            WCSession.default.sendMessage(message, replyHandler:
                                            { [self](result) -> Void in
            print("Message sent!")
            }, errorHandler:
                {(error) -> Void in
                print("Failed!")
                print(error)
            })
        }
    }
    
    override func willActivate() {
        // This method is called when watch view controller is about to be visible to user
    }
    
    override func didDeactivate() {
        // This method is called when watch view controller is no longer visible
    }

}
