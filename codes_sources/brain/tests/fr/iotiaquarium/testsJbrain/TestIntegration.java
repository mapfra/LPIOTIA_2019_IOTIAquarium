package fr.iotiaquarium.testsJbrain;

import static org.junit.Assert.assertEquals;

import java.util.ArrayList;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import com.dieunelson.labyrinthai.core.brain.*;

public class TestIntegration {
	
	@Test
	@DisplayName("Test test jbrian")
	public final void testSampleNeuralNetwork() { 
		
		//Un neuron est toujours liée à une neurontask
		NeuronTask<Object> task1 = new NeuronTask<Object>() {

			@Override
			public Object execute(ArrayList<Object> arg0) {
				
				int T=2;
				int T1=2;
				Object result = ((Integer)T)+((Integer)T1);
				
				return result;
			}
			
		};
		//instanciation d'un neurone
		Neuron<Object> n1 = new Neuron<Object>(task1);
		//un neuron est toujour lié à un moniteur qui monitor le resulat final
		NeuronMonitor<Object> monitor = new NeuronMonitor<Object>(n1);
		//demarrage du neuronne (start car est considéré comme une stread)
		n1.start();
		Object result = monitor.getResult();
		assertEquals(result, 4);
	}
	
	

	@Test
	@DisplayName("Test test jbrian2")
public final void testSample() { 
	
	 ArrayList<Object> l1 = new ArrayList<Object>();
	    l1.add(12);
	    l1.add("toto ! !");
	    l1.add(12.20f);
		
		NeuronTask<Object> task2 = new NeuronTask<Object>() {

			@Override
			public Object execute(ArrayList<Object> inputs) {

				Object result = ((Integer)inputs.get(0)*((float)inputs.get(2)));
				
				return result;
			}
			
		};
		
		Neuron<Object> n2 = new Neuron<Object>(task2);
		n2.setInputs(l1);
		NeuronMonitor<Object> monitor = new NeuronMonitor<Object>(n2);
		n2.start();
		Object result = monitor.getResult();
		assertEquals(result, 146.4f);
	}
	
	
}
