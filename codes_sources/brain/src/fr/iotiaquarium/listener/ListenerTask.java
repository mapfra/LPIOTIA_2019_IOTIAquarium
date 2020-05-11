package fr.iotiaquarium.listener;

import java.io.IOException;
import java.net.ServerSocket;

public class ListenerTask implements Runnable{

	private ServerSocket socket;
	
	public ListenerTask(int port) throws IOException {
		this.socket = new ServerSocket(port);		
	}
	
	@Override
	public void run() {
		
		
		
		
	}

	
}
