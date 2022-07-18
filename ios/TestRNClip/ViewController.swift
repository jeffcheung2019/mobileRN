//
//  ViewController.swift
//  TestRNClip
//
//

import UIKit
import StoreKit

class ViewController: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view.
    }

  @IBAction func downloadFullVersionPressed(_ sender: Any) {
      
      guard let scene = view.window?.windowScene else { return }
      let config = SKOverlay.AppClipConfiguration(position: .bottom)
      let overlay = SKOverlay(configuration: config)
      overlay.delegate = self
      overlay.present(in: scene)
  }
}

extension ViewController : SKOverlayDelegate {
    
    func storeOverlayDidFailToLoad(_ overlay: SKOverlay, error: Error) {
     
    }
    
    func storeOverlayWillStartDismissal(_ overlay: SKOverlay, transitionContext: SKOverlay.TransitionContext) {
       
    }
    
    func storeOverlayWillStartPresentation(_ overlay: SKOverlay, transitionContext: SKOverlay.TransitionContext) {

    }
    
    func storeOverlayDidFinishDismissal(_ overlay: SKOverlay, transitionContext: SKOverlay.TransitionContext) {
        print("SKOverlay DidFinishDismissal")
    }
    
    func storeOverlayDidFinishPresentation(_ overlay: SKOverlay, transitionContext: SKOverlay.TransitionContext) {
        print("SKOverlay DidFinishPresentation")
    }

}

