package fr.iotiaquarium.task;

import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;

import com.dieunelson.labyrinthai.core.brain.NeuronTask;

public class TranslatorTask implements NeuronTask<Object>{

	private String separator;

	public String getSeparator() {
		return separator;
	}

	public void setSeparator(String separator) {
		this.separator = separator;
	}

	public TranslatorTask(String seperator) {
		this.setSeparator(seperator);
	}

	@Override
	public Object execute(ArrayList<Object> inputs) {

		if(inputs.isEmpty()!=true)//ON REGARDE SI LE TABLEAU EST VIDE 
		{

		for (Object O: inputs)
		{
				// PARTIE1 : SPLIT DATA
				Object obj1= inputs.get(0);
				String pobj1= (String)obj1;			
				String[] splitArray;
				// ON DECOUPE LA CHAINE "pobj1" ET ON RECUPERE LE RESULTAT DANS LE TABLEAU "splitArray"
				splitArray = pobj1.split(separator);

				ArrayList<Object> output= new ArrayList<Object>();
				
				// PARTIE 2 : RECUPERATION DES VALEURS
				for (String str : splitArray)
				{
					String[] splitArray2;
					splitArray2 = str.split("=");		
					try {					
						Class<?> componentclass = Class.forName("fr.iotiaquarium.component."+splitArray2[0]);
						Constructor<?> constructor = componentclass.getConstructor(Object.class);
						Object instance = constructor.newInstance(Double.valueOf(splitArray2[1]));
						output.add(instance);
						
						
						
					}catch( ClassNotFoundException | NoSuchMethodException | SecurityException | InstantiationException | IllegalAccessException | IllegalArgumentException | InvocationTargetException e ) {
						System.err.println("ClassNotFound "+ splitArray2[0]);
						return null;
					}
					
				}
				
				return output;


			}
		}
		System.err.println("Input Empty");
		return null;

	}
}
