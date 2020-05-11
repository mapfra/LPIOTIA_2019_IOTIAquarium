package fr.iotiaquarium.listener;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.ServerSocket;
import java.net.Socket;

import com.dieunelson.labyrinthai.core.brain.Neuron;
import com.dieunelson.labyrinthai.core.brain.Synapse;

public class ListenerNeuron extends Neuron<Object>{

	private ServerSocket socket;
	private Socket client;
	private boolean running;
	private int countOutputSynapses;
	
	public ListenerNeuron(int port) throws IOException {
		super(null);
		this.socket = new ServerSocket(port);
		this.running = false;
	}
	
	@Override
	public void run() {
		this.running = true;
		
		//	ecouter la socket
		try {
			System.out.println("RUNNING");
			while(running) {
				System.out.println("WAIT");
				this.client = socket.accept();
				System.out.println("ACCEPT");
				InputStream input = client.getInputStream();
				InputStreamReader inputReader = new InputStreamReader(input);
				BufferedReader buffer = new BufferedReader(inputReader);
				String data;
				

				System.out.println("WAIT DATA");
				while((data=buffer.readLine())!=null) {
					
					System.out.println("RECEIVE :"+data);
					
					for (int i = 0; i < this.countOutputSynapses; i++) {
						this.getOutputSynapse(i).setValue(data);
					}
				}
			}
			
			System.out.println("SERVER CLOSING");
			this.socket.close();
			
			
		} catch (IOException e) {
			e.printStackTrace();
		}
		
	}
	
	public void close() {
		this.running = false;

	}
	
	
	@Override
	public void addOutputSynapse(Synapse<Object> synapse) {
		this.countOutputSynapses++;
		super.addOutputSynapse(synapse);
	}

	public ServerSocket getSocket() {
		return socket;
	}

	public void setSocket(ServerSocket socket) {
		this.socket = socket;
	}
	
	

}
