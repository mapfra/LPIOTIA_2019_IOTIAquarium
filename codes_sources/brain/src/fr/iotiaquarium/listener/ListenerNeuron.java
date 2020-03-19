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
		
		//	ecouter la socket
		try {
			while(running) {
				this.client = socket.accept();
				
				InputStream input = client.getInputStream();
				InputStreamReader inputReader = new InputStreamReader(input);
				BufferedReader buffer = new BufferedReader(inputReader);
				String data;
				
				while((data=buffer.readLine())!=null) {
					for (int i = 0; i < this.countOutputSynapses; i++) {
						this.getOutputSynapse(i).setValue(data);
					}
				}
			}
			
			this.client.close();
			this.socket.close();
			
			
		} catch (IOException e) {
			e.printStackTrace();
		}
		
	}
	
	
	@Override
	public void addOutputSynapse(Synapse<Object> synapse) {
		this.countOutputSynapses++;
		super.addOutputSynapse(synapse);
	}
	
	

}
