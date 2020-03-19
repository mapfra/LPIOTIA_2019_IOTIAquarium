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
				// TODO Auto-generated method stub
				int T=2;
				int T1=2;
				return T+T1;
			}
			
		};
		
		Neuron<Object> n1 = new Neuron<Object>(task1);
		NeuronMonitor<Object> monitor = new NeuronMonitor<Object>(n1);
		
		int result = (int)monitor.getResult();
		
		n1.start();
		
		assertEquals(result, 4);
		
		
		
		
		

	}
}
