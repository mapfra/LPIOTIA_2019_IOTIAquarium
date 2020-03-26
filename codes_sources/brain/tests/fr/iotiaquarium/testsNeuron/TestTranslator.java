package fr.iotiaquarium.testsNeuron;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import java.util.ArrayList;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import com.dieunelson.labyrinthai.core.brain.Neuron;
import com.dieunelson.labyrinthai.core.brain.NeuronMonitor;
import com.dieunelson.labyrinthai.core.brain.NeuronTask;

import fr.iotiaquarium.component.TriggerComponent;
import fr.iotiaquarium.task.TranslatorTask;

public class TestTranslator {
	
	
	@Test
	@DisplayName("Test lecture")
	public void testtranslator()
	{
		String test = "Feeder=1;Pumpe=2.5";
		
		TranslatorTask TT1 = new TranslatorTask(";");
		
		Neuron<Object> nt1 = new Neuron<Object>(TT1);
		ArrayList<Object> inputs = new ArrayList<Object>();
		inputs.add(test);
		
		nt1.setInputs(inputs);
		
		NeuronMonitor<Object> monitor = new NeuronMonitor<Object>(nt1);
		
		nt1.start();
		
		ArrayList<Object> result = (ArrayList<Object>) monitor.getResult();
		
		for (Object object : result) {
			System.out.println(object.getClass() + " - " +((TriggerComponent)object).getStatus());
		}
		
		
		assertTrue(!result.isEmpty());
		
		
	}
	

}
