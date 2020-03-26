package fr.iotiaquarium.testsNeuron;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.ArrayList;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import com.dieunelson.labyrinthai.core.brain.Neuron;
import com.dieunelson.labyrinthai.core.brain.NeuronMonitor;

import fr.iotiaquarium.component.Feeder;
import fr.iotiaquarium.component.LightSensor;
import fr.iotiaquarium.component.Pumpe;
import fr.iotiaquarium.task.ComponentTask;

public class TestComponent {
	
	@Test
	@DisplayName("Test lecture")
	public void testComponent ()
	{
		
		ArrayList<Object> testobj = new ArrayList<Object>();
		testobj.add(new Feeder(1));
		testobj.add(new Pumpe(1));
		testobj.add(new LightSensor(9));
		
		Neuron<Object> nt = new Neuron<Object>(new ComponentTask(Feeder.class));
		
		NeuronMonitor<Object> monitor = new NeuronMonitor<Object>(nt);
		
		nt.start();
		
		ArrayList<Object> result = (ArrayList<Object>) monitor.getResult();
		
		boolean test = true;
		
		for(Object o : result)
		{
			if (!o.getClass().equals(Feeder.class))
			{
				test= false;
			}
		}
		assertEquals(true, test);	
	}

}
