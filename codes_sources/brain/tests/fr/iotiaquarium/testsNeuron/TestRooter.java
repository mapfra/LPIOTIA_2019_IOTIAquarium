package fr.iotiaquarium.testsNeuron;

import java.io.IOException;

import org.junit.jupiter.api.Test;

import fr.iotiaquarium.task.RooterTask;

public class TestRooter {

	
    
    
    @Test
    public void testListClass() {
    	try {
    		
    		Class<?>[] name = RooterTask.getClasses("fr.iotiaquarium.component");
			for(Class<?> n : name) {
				System.out.println(n.getName());
			}
		} catch (ClassNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
    }
}
