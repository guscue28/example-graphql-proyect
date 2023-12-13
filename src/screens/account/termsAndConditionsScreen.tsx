import * as React from 'react';
import { Block, Text } from 'galio-framework';
import { Dimensions, StyleSheet } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { ScrollView } from 'react-native-gesture-handler';
const width = Dimensions.get('window').width;

export const TermsAndConditionsScreen = () => {
  return (
    <Block middle style={style.container}>
      <ScrollView>
        <Text color="black">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quo, odit ut. Doloribus, accusamus itaque? Ipsum iusto mollitia recusandae esse deleniti
          officiis natus similique ipsa minus possimus, facere cupiditate ab repellat! Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore animi
          dolorum recusandae vero, placeat deleniti repudiandae, sapiente fugiat quo, ipsum natus quaerat atque dolores rem alias veritatis unde laudantium
          fugit. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Doloribus nostrum ipsa porro sit laborum voluptatibus eius iste, tempore enim soluta
          dolorem nulla molestias corporis exercitationem repudiandae fuga facere dicta? Aspernatur. Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Necessitatibus unde natus exercitationem quae quos quisquam? Excepturi sed quod adipisci dolore porro minus nulla natus, et laudantium quidem, placeat
          quos ratione. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Doloribus nostrum ipsa porro sit laborum voluptatibus eius iste, tempore enim
          soluta dolorem nulla molestias corporis exercitationem repudiandae fuga facere dicta? Aspernatur. Lorem ipsum dolor sit amet consectetur adipisicing
          elit. Necessitatibus unde natus exercitationem quae quos quisquam? Excepturi sed quod adipisci dolore porro minus nulla natus, et laudantium quidem,
          placeat quos ratione.
        </Text>
        <Text style={{ marginTop: 20 }} color="black">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quo, odit ut. Doloribus, accusamus itaque? Ipsum iusto mollitia recusandae esse deleniti
          officiis natus similique ipsa minus possimus, facere cupiditate ab repellat! Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore animi
          dolorum recusandae vero, placeat deleniti repudiandae, sapiente fugiat quo, ipsum natus quaerat atque dolores rem alias veritatis unde laudantium
          fugit. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Doloribus nostrum ipsa porro sit laborum voluptatibus eius iste, tempore enim soluta
          dolorem nulla molestias corporis exercitationem repudiandae fuga facere dicta? Aspernatur. Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Necessitatibus unde natus exercitationem quae quos quisquam? Excepturi sed quod adipisci dolore porro minus nulla natus, et laudantium quidem, placeat
          quos ratione. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quo, odit ut. Doloribus, accusamus itaque? Ipsum iusto mollitia recusandae
          esse deleniti officiis natus similique ipsa minus possimus, facere cupiditate ab repellat! Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Inventore animi dolorum recusandae vero, placeat deleniti repudiandae, sapiente fugiat quo, ipsum natus quaerat atque dolores rem alias veritatis unde
          laudantium fugit.
        </Text>
        <Text style={{ marginTop: 20 }} color="black">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Doloribus nostrum ipsa porro sit laborum voluptatibus eius iste, tempore enim soluta dolorem
          nulla molestias corporis exercitationem repudiandae fuga facere dicta? Aspernatur. Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Necessitatibus unde natus exercitationem quae quos quisquam? Excepturi sed quod adipisci dolore porro minus nulla natus, et laudantium quidem, placeat
          quos ratione. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quo, odit ut. Doloribus, accusamus itaque? Ipsum iusto mollitia recusandae
          esse deleniti officiis natus similique ipsa minus possimus, facere cupiditate ab repellat! Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Inventore animi dolorum recusandae vero, placeat deleniti repudiandae, sapiente fugiat quo, ipsum natus quaerat atque dolores rem alias veritatis unde
          laudantium fugit.
        </Text>
        <Block style={{ height: moderateScale(60) }} />
      </ScrollView>
    </Block>
  );
};

export const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: '#fff',
    paddingVertical: moderateScale(30),
    width: width / 1.2,
  },
});
