import React, {Component} from 'react';
import {
  View,
  ScrollView,
  Image,
  Text,
  TextInput,
  TouchableHighlight,
  StyleSheet,
} from 'react-native';
import Style from "../Style";

class InputDemo extends Component {

  static AUTOCOMPLETE_THRESHOLD = 600;

  constructor(props) {
    super(props);
    // Bind function
    this.resetSearch = this.resetSearch.bind(this);
    this.triggerAutocompleteSearch = this.triggerAutocompleteSearch.bind(this);
    // Init
    this.autocompleteTimer = null;
    // Init refs
    this.inputTextRef = React.createRef();
    // Init state
    this.state = {
      textInputFocused: false,
      clearButtonFocused: false,
      searchResults: [],
      searchResultsEmpty: false,
    };
  }

  resetSearch() {
    // Reset search
    this.setState({
      searchResults: [],
      searchResultsEmpty: false,
    });
  }

  triggerAutocompleteSearch(text) {
    console.log("triggerAutocompleteSearch(" + text + ")");
    if(text === '') {
      this.resetSearch();
      return;
    }
    // Filter list of countries
    const searchResults = countries.filter(
      country => {
        return country.toLowerCase().indexOf(text.toLowerCase()) === 0;
      }
    );
    // Show results
    this.setState({
      searchResults: searchResults,
      searchResultsEmpty: searchResults.length === 0
    });
  }

  onKeyPress(event) {
    //console.log("onKeyPress", event);
  }

  onChange(event) {
    //console.log("onChange", event);
  }

  onChangeText(text) {
    //console.log("onChangeText", text);
    if(this.autocompleteTimer) {
      clearTimeout(this.autocompleteTimer);
    }
    this.autocompleteTimer = setTimeout(
      ()=> {
        this.triggerAutocompleteSearch(text)
      },
      InputDemo.AUTOCOMPLETE_THRESHOLD
    )
  }

  onSubmitEditing(event) {
    //console.log("onEndEditing", event);
  }

  render() {
    return (
      <View style={Style.styles.right}>
        <View style={Style.styles.header}>
          <Text style={Style.styles.headerText}>{"Input Demo"}</Text>
        </View>
        <View style={Style.styles.content}>
          <View style={[
              styles.textInputContainer,
              this.state.textInputFocused && styles.textInputContainerFocused
          ]}>
            <TextInput
              ref={ref => this.inputTextRef = ref}
              onKeyPress={this.onKeyPress.bind(this)}
              onChange={this.onChange.bind(this)}
              onChangeText={this.onChangeText.bind(this)}
              onSubmitEditing={this.onSubmitEditing.bind(this)}
              onFocus={()=>this.setState({textInputFocused: true})}
              onBlur={()=>this.setState({textInputFocused: false})}
              placeholder={"Search..."}
              placeholderTextColor={"gray"}
              clearButtonMode={'always'}
              autoCorrect={false}
              autoFocus={false}
              style={styles.textInput}
            />
            <TouchableHighlight
              onPress={()=>{
                if(this.inputTextRef) {
                  this.inputTextRef.clear();
                  this.resetSearch();
                }
              }}
              onFocus={()=>{this.setState({clearButtonFocused: true})}}
              onBlur={()=>{this.setState({clearButtonFocused: false})}}
              underlayColor={"transparent"}
              style={[
                styles.textInputClearButton,
                this.state.clearButtonFocused && styles.textInputClearButtonFocused
              ]}
            >
              <Image
                source={require('../../assets/clear.png')}
                style={styles.textInputClearImage}
              />
            </TouchableHighlight>
          </View>
          <ScrollView style={styles.searchResultsContainer}>
            <Text style={styles.searchResults}>
              {this.state.searchResultsEmpty ? "No results" : this.state.searchResults.join("\n")}
            </Text>
          </ScrollView>
        </View>
      </View>
    );
  }
}

export default InputDemo;

const styles = StyleSheet.create({
  textInputContainer: {
    position: 'absolute',
    top: 0,
    width: Style.px(680),
    height: Style.px(80),
    backgroundColor: 'white',
    borderColor: 'transparent',
    borderRadius: Style.px(5),
    borderWidth: Style.px(5),
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInputContainerFocused: {
    borderColor: '#61dafb'
  },
  textInput: {
    width: Style.px(600),
    height: Style.px(70),
    padding: Style.px(20),
    fontSize: Style.px(40),
  },
  textInputClearButton: {
    width: Style.px(50),
    height: Style.px(50),
    marginLeft: Style.px(10),
    marginRight: Style.px(10),
    borderRadius: Style.px(5),
    borderWidth: Style.px(5),
    borderColor: 'transparent',
  },
  textInputClearButtonFocused: {
    borderColor: '#61dafb',
  },
  textInputClearImage: {
    width: Style.px(40),
    height: Style.px(40),
  },
  searchResultsContainer: {
    position: 'absolute',
    top: Style.px(100),
    width: Style.px(680),
    height: Style.px(600),
  },
  searchResults: {
    fontSize: Style.px(30),
    color: 'white',
  },
});

const countries = [
  'Afghanistan',
  'Akrotiri',
  'Albania',
  'Algeria',
  'American Samoa',
  'Andorra',
  'Angola',
  'Anguilla',
  'Antarctica',
  'Antigua and Barbuda',
  'Argentina',
  'Armenia',
  'Aruba',
  'Ashmore and Cartier Islands',
  'Australia',
  'Austria',
  'Azerbaijan',
  'Bahamas, The',
  'Bahrain',
  'Bangladesh',
  'Barbados',
  'Bassas da India',
  'Belarus',
  'Belgium',
  'Belize',
  'Benin',
  'Bermuda',
  'Bhutan',
  'Bolivia',
  'Bosnia and Herzegovina',
  'Botswana',
  'Bouvet Island',
  'Brazil',
  'British Indian Ocean Territory',
  'British Virgin Islands',
  'Brunei',
  'Bulgaria',
  'Burkina Faso',
  'Burma',
  'Burundi',
  'Cambodia',
  'Cameroon',
  'Canada',
  'Cape Verde',
  'Cayman Islands',
  'Central African Republic',
  'Chad',
  'Chile',
  'China',
  'Christmas Island',
  'Clipperton Island',
  'Cocos (Keeling) Islands',
  'Colombia',
  'Comoros',
  'Congo',
  'Cook Islands',
  'Coral Sea Islands',
  'Costa Rica',
  'Cote d\'Ivoire',
  'Croatia',
  'Cuba',
  'Cyprus',
  'Czech Republic',
  'Denmark',
  'Dhekelia',
  'Djibouti',
  'Dominica',
  'Dominican Republic',
  'Ecuador',
  'Egypt',
  'El Salvador',
  'Equatorial Guinea',
  'Eritrea',
  'Estonia',
  'Ethiopia',
  'Europa Island',
  'Falkland Islands',
  'Faroe Islands',
  'Fiji',
  'Finland',
  'France',
  'French Guiana',
  'French Polynesia',
  'French Southern and Antarctic Lands',
  'Gabon',
  'Gambia,',
  'Gaza Strip',
  'Georgia',
  'Germany',
  'Ghana',
  'Gibraltar',
  'Glorioso Islands',
  'Greece',
  'Greenland',
  'Grenada',
  'Guadeloupe',
  'Guam',
  'Guatemala',
  'Guernsey',
  'Guinea',
  'Guinea-Bissau',
  'Guyana',
  'Haiti',
  'Heard Island and McDonald Islands',
  'Holy See (Vatican City)',
  'Honduras',
  'Hong Kong',
  'Hungary',
  'Iceland',
  'India',
  'Indonesia',
  'Iran',
  'Iraq',
  'Ireland',
  'Isle of Man',
  'Israel',
  'Italy',
  'Jamaica',
  'Jan Mayen',
  'Japan',
  'Jersey',
  'Jordan',
  'Juan de Nova Island',
  'Kazakhstan',
  'Kenya',
  'Kiribati',
  'Korea, North',
  'Korea, South',
  'Kuwait',
  'Kyrgyzstan',
  'Laos',
  'Latvia',
  'Lebanon',
  'Lesotho',
  'Liberia',
  'Libya',
  'Liechtenstein',
  'Lithuania',
  'Luxembourg',
  'Macau',
  'Macedonia',
  'Madagascar',
  'Malawi',
  'Malaysia',
  'Maldives',
  'Mali',
  'Malta',
  'Marshall Islands',
  'Martinique',
  'Mauritania',
  'Mauritius',
  'Mayotte',
  'Mexico',
  'Micronesia, Federated States of',
  'Moldova',
  'Monaco',
  'Mongolia',
  'Montserrat',
  'Morocco',
  'Mozambique',
  'Namibia',
  'Nauru',
  'Navassa Island',
  'Nepal',
  'Netherlands',
  'Netherlands Antilles',
  'New Caledonia',
  'New Zealand',
  'Nicaragua',
  'Niger',
  'Nigeria',
  'Niue',
  'Norfolk Island',
  'Northern Mariana Islands',
  'Norway',
  'Oman',
  'Pakistan',
  'Palau',
  'Panama',
  'Papua New Guinea',
  'Paracel Islands',
  'Paraguay',
  'Peru',
  'Philippines',
  'Pitcairn Islands',
  'Poland',
  'Portugal',
  'Puerto Rico',
  'Qatar',
  'Reunion',
  'Romania',
  'Russia',
  'Rwanda',
  'Saint Helena',
  'Saint Kitts and Nevis',
  'Saint Lucia',
  'Saint Pierre and Miquelon',
  'Saint Vincent and the Grenadines',
  'Samoa',
  'San Marino',
  'Sao Tome and Principe',
  'Saudi Arabia',
  'Senegal',
  'Serbia and Montenegro',
  'Seychelles',
  'Sierra Leone',
  'Singapore',
  'Slovakia',
  'Slovenia',
  'Solomon Islands',
  'Somalia',
  'South Africa',
  'South Georgia and the South Sandwich Islands',
  'Spain',
  'Spratly Islands',
  'Sri Lanka',
  'Sudan',
  'Suriname',
  'Svalbard',
  'Swaziland',
  'Sweden',
  'Switzerland',
  'Syria',
  'Taiwan',
  'Tajikistan',
  'Tanzania',
  'Thailand',
  'Timor-Leste',
  'Togo',
  'Tokelau',
  'Tonga',
  'Trinidad and Tobago',
  'Tromelin Island',
  'Tunisia',
  'Turkey',
  'Turkmenistan',
  'Turks and Caicos Islands',
  'Tuvalu',
  'Uganda',
  'Ukraine',
  'United Arab Emirates',
  'United Kingdom',
  'United States',
  'Uruguay',
  'Uzbekistan',
  'Vanuatu',
  'Venezuela',
  'Vietnam',
  'Virgin Islands',
  'Wake Island',
  'Wallis and Futuna',
  'West Bank',
  'Western Sahara',
  'Yemen',
  'Zambia',
  'Zimbabwe'
];