package fr.iotiaquarium.testsNeuron;

import static org.junit.Assert.assertTrue;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetAddress;
import java.net.Socket;
import java.util.ArrayList;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import com.dieunelson.labyrinthai.core.brain.Neuron;
import com.dieunelson.labyrinthai.core.brain.NeuronMonitor;
import com.dieunelson.labyrinthai.core.brain.NeuronTask;
import com.dieunelson.labyrinthai.core.brain.Synapse;

import fr.iotiaquarium.listener.ListenerNeuron;

public class TestListener {

	@Test
	@DisplayName("Test lecture")
	public void testConnection() {
		
		Socket client;
		NeuronTask<Object> task = new NeuronTask<Object>() {

			@Override
			public Object execute(ArrayList<Object> inputs) {
				
				return inputs.get(0);
			}
			
		};
		
		
		try {
			ListenerNeuron listener = new ListenerNeuron(1000);
			Neuron<Object> receiver = new Neuron<Object>(task);
			Synapse<Object> synapse = new Synapse<Object>();
			listener.addOutputSynapse(synapse);
			receiver.addInputSynapse(synapse);
			
			NeuronMonitor<Object> monitor = new NeuronMonitor<Object>(receiver);
			
			listener.start();
			receiver.start();
			
			Thread.sleep(1000);
			
			//
			System.out.println("TRY TO CONNECT - "+ listener.getSocket().getInetAddress().getHostName()+" : "+listener.getSocket().getLocalPort());
			client = new Socket(InetAddress.getByName("192.168.43.123"), 1000);
			OutputStream out = client.getOutputStream();
			
			Thread.sleep(1000);
			
			//
			String data = "Hello World\n";
			System.out.println("SENDING : "+data);
			out.write(data.getBytes());			
			
			
			System.out.println(monitor.getResult());
			
			listener.close();
			
			assertTrue(monitor.getResult()!=null && !((String)monitor.getResult()).equals(""));
			
		} catch (IOException | InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}
