import * as React from 'react';

import {
  FocusAwareStatusBar,
  SafeAreaView,
  ScrollView,
  Text,
} from '@/components/ui';

export default function Map() {
  return (
    <>
      <FocusAwareStatusBar />
      <ScrollView className="px-4">
        <SafeAreaView className="flex-1">
          <Text className="text-center">Map</Text>
        </SafeAreaView>
      </ScrollView>
    </>
  );
}
