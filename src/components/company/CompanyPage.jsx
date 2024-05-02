import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCompaniesStore } from '../../store/index.js';
import CreateEventModal from '../event/CreateEventModal.jsx';
import EventItem from '../event/EventItem.jsx';
import useEventsStore from '../../store/events.js';
import { Box, 
    Center, 
    Text, 
    Button, 
    Input, 
    Textarea, 
    Image } from '@chakra-ui/react';

const CompanyPage = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const { companyId } = useParams();

    const { companies, userCompanies, uploadLogo, updateCompany } = useCompaniesStore();
    const { getEventsByCompanyId } = useEventsStore();
    const events = getEventsByCompanyId(companyId);

    const selectedCompany = companies.find((company) => company.id === parseInt(companyId));
    const isOwner = userCompanies.some((company) => company.id === parseInt(companyId));

    useEffect(() => {
        // Populate form fields with selected company data
        if (selectedCompany) {
            setName(selectedCompany.name);
            setDescription(selectedCompany.description);
            setLocation(selectedCompany.location);
        }
    }, [selectedCompany]);

    const handleLogoClick = async () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = async (event) => {
            const file = event.target.files[0];
            if (file) {
                await uploadLogo(file, companyId);
            }
        };
        input.click();
    };

    const handleDeleteCompany = () => {
        // TODO: Implement delete company functionality
    };

    const handleSubmitChanges = async (e) => {
        e.preventDefault();
        const updatedCompany = {
            name: name,
            description: description,
            location: location
        };
    
        try {
            await updateCompany(updatedCompany, companyId); // Call updateCompany from Zustand store
            // Optionally, you could handle success or navigate after update
            window.location.reload();
        } catch (error) {
            console.error('Error updating company:', error);
        }
    };

    const getUserAvatar = () => {
        return selectedCompany?.logo || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
    };

    return (
        <Center>
            <Box
                w="40%"
                h="100vh"
                backgroundColor="#E2E8F0"
                textAlign="center"
                overflowY="auto"
                p={6}
                display="flex"
                flexDirection="column"
                justifyContent="center"
                
            >
                {isOwner ? (
                    <Image
                        src={getUserAvatar()}
                        alt="Company Logo"
                        boxSize='40%'
                        objectFit="cover"
                        onClick={handleLogoClick}
                        border="3px solid white"
                        borderRadius="full"
                        style={{ margin: "auto" }}
                    />
                ) : (
                    <Image
                        src={getUserAvatar()}
                        alt="Company Logo"
                        boxSize='40%'
                        objectFit="cover"
                        border="3px solid white"
                        borderRadius="full"
                        style={{ margin: "auto" }}
                    />
                )}

                <div style={{ marginTop: '20px' }}>
                    <Text fontSize="30px" fontWeight="bold" mb={2}>
                        {selectedCompany.name}
                    </Text>
                    <Text as="i" fontSize="20px" color="gray.600" mb={2}>
                        Location: {selectedCompany.location}
                    </Text>
                    <Text fontSize="18px" color="gray.600" mt={2} mb={4}>
                        {selectedCompany.description}
                    </Text>
                </div>

                {isOwner && (
                    <Box border="1px" borderRadius="1rem">
                        <Text fontWeight='bold' fontSize='25px' mb={4}>Change information</Text>
                        <form onSubmit={handleSubmitChanges} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Input
                                mb={4}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                variant="flushed"
                                placeholder="Company name"
                                w='60%'
                                borderRadius='1px'
                                borderColor='black'
                            />
                            <Input
                                mb={4}
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                variant="flushed"
                                placeholder="Location"
                                w='60%'
                                borderRadius='1px'
                                borderColor='black'
                            />
                            <Textarea
                                mb={4}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                variant="flushed"
                                placeholder="Description"
                                rows={4}
                                w='60%'
                                borderRadius='1px'
                                borderColor='black'
                            />
                            <Box mt={4} mb={4} width="60%" display="flex" justifyContent="space-between">
                                <Button type='submit' color='#49AA87'>
                                    Save changes
                                </Button>
                                <CreateEventModal companyId={companyId} />
                                <Button type='button' color='red' onClick={handleDeleteCompany}>
                                    Delete company
                                </Button>
                            </Box>
                        </form>
                    </Box>
                )}
            </Box>

            <Box w="30%" h="100vh" backgroundColor="#49AA87" textAlign="center" overflowY="auto">
                <Text fontSize="30px" fontWeight="bold" mb={4}>
                    Company events
                </Text>
                <div>
                    {events.map(event => (
                        <div key={event.id} className="p-4">
                            <EventItem key={event.id} event={event}/>
                        </div>
                    ))}
                </div>
            </Box>
        </Center>
    );
};

export default CompanyPage;
