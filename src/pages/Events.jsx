import { useState } from 'react';
import { useEvents, useAddEvent, useUpdateEvent, useDeleteEvent } from '../integrations/supabase/index.js';
import { Box, Button, Input, VStack, HStack, Text, Spinner } from '@chakra-ui/react';

const Events = () => {
  const { data: events, isLoading, isError } = useEvents();
  const addEvent = useAddEvent();
  const updateEvent = useUpdateEvent();
  const deleteEvent = useDeleteEvent();

  const [newEvent, setNewEvent] = useState({ name: '', date: '', venue: '' });
  const [editingEvent, setEditingEvent] = useState(null);

  const handleAddEvent = () => {
    addEvent.mutate(newEvent);
    setNewEvent({ name: '', date: '', venue: '' });
  };

  const handleUpdateEvent = () => {
    updateEvent.mutate(editingEvent);
    setEditingEvent(null);
  };

  const handleDeleteEvent = (id) => {
    deleteEvent.mutate(id);
  };

  if (isLoading) return <Spinner />;
  if (isError) return <Text>Error loading events</Text>;

  return (
    <Box p={4}>
      <VStack spacing={4}>
        <HStack>
          <Input placeholder="Event Name" value={newEvent.name} onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })} />
          <Input type="date" value={newEvent.date} onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })} />
          <Input placeholder="Venue ID" value={newEvent.venue} onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })} />
          <Button onClick={handleAddEvent}>Add Event</Button>
        </HStack>
        {events.map((event) => (
          <Box key={event.id} p={4} borderWidth="1px" borderRadius="lg" w="100%">
            {editingEvent?.id === event.id ? (
              <HStack>
                <Input placeholder="Event Name" value={editingEvent.name} onChange={(e) => setEditingEvent({ ...editingEvent, name: e.target.value })} />
                <Input type="date" value={editingEvent.date} onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })} />
                <Input placeholder="Venue ID" value={editingEvent.venue} onChange={(e) => setEditingEvent({ ...editingEvent, venue: e.target.value })} />
                <Button onClick={handleUpdateEvent}>Update</Button>
                <Button onClick={() => setEditingEvent(null)}>Cancel</Button>
              </HStack>
            ) : (
              <HStack justify="space-between">
                <Text>{event.name}</Text>
                <Text>{event.date}</Text>
                <Text>{event.venue}</Text>
                <Button onClick={() => setEditingEvent(event)}>Edit</Button>
                <Button onClick={() => handleDeleteEvent(event.id)}>Delete</Button>
              </HStack>
            )}
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default Events;