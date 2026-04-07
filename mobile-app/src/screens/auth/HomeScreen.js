import { View, Text } from 'react-native';
import IncidentCard from '../../components/cards/incidentCards';

const HomeScreen = () => {
  return (
    <View className="flex-1 p-4 bg-white">
      <Text className="text-[20px] font-bold mb-5">Welcome to the Home Screen</Text>
      <IncidentCard
        type="Emergency"
        status="Active"
        description="A major incident reported near downtown."
        location="Downtown Area"
        timeAgo="10m ago"
        verifications={3}
        onPress={() => console.log("Card pressed")}
      />
    </View>
  );
};

export default HomeScreen;