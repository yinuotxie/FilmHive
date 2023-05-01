import React, { useState } from "react"
import { Checkbox, Slider, Select, Button, Input } from "antd"

const { Option } = Select

const MovieFilter = ({ onFiltersChange }) => {

  const [searchValue, setSearchValue] = useState("")
  const [genre, setGenre] = useState("")
  const [region, setRegion] = useState("")
  const [runtimeMin, setRuntimeMin] = useState(0)
  const [runtimeMax, setRuntimeMax] = useState(300)
  const [ratingMin, setRatingMin] = useState(0)
  const [ratingMax, setRatingMax] = useState(10)
  const [releaseYearMin, setReleaseYearMin] = useState(1900)
  const [releaseYearMax, setReleaseYearMax] = useState(2025)
  const [awarded, setAwarded] = useState(false)
  const [nominated, setNominated] = useState(false)
  const [rated, setRated] = useState(false)

  const handleSearchValueChange = (e) => {
    setSearchValue(e.target.value)
  }

  const handleGenreChange = (value) => {
    setGenre(value)
  }

  const handleRegionChange = (value) => {
    setRegion(value)
  }

  const handleRuntimeChange = (value) => {
    setRuntimeMin(value[0])
    setRuntimeMax(value[1])
  }

  const handleRatingChange = (value) => {
    setRatingMin(value[0])
    setRatingMax(value[1])
  }

  const handleReleaseYearChange = (value) => {
    setReleaseYearMin(value[0])
    setReleaseYearMax(value[1])
  }

  const handleAwardedChange = (value) => {
    setAwarded(value)
    setNominated(false)
  }

  const handleNominatedChange = (value) => {
    setNominated(value)
    setAwarded(false)
  }

  const handleRatedChange = (value) => {
    setRated(value)
  }

  const handleConfirmClick = () => {
    const updatedFilters = {
      searchValue: searchValue,
      genre: genre,
      region: region,
      runtimeMin: runtimeMin,
      runtimeMax: runtimeMax,
      ratingMin: ratingMin,
      ratingMax: ratingMax,
      releaseYearMin: releaseYearMin,
      releaseYearMax: releaseYearMax,
      awarded: awarded,
      nominated: nominated,
      rated: rated
    }
    onFiltersChange(updatedFilters)
  }

  return (
    <div
      style={{
        width: '100%',
        marginBottom: 10,
        border: '2px solid #ccc',
        borderRadius: 5,
        padding: 10,
        backgroundImage: `url(${"https://wallpapercave.com/wp/wp4009237.jpg"})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
      }}
    >
      <Input
        placeholder="Input the name of a movie!"
        value={searchValue}
        onChange={handleSearchValueChange}
        style={{ width: '30%', marginRight: 10, marginBottom: 10 }}
      />
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ width: '60%', display: 'flex', flexDirection: 'row', alignItems: 'center', marginLeft: 30 }}>
          <Select
            placeholder="Genre"
            onChange={handleGenreChange}
            style={{ width: '20%', marginRight: 50, marginLeft: 150 }}
          >
            <Option value=""></Option>
            <Option value="action">Action</Option>
            <Option value="adult">Adult</Option>
            <Option value="adventure">Adventure</Option>
            <Option value="animation">Animation</Option>
            <Option value="biography">Biography</Option>
            <Option value="comedy">Comedy</Option>
            <Option value="crime">Crime</Option>
            <Option value="documentary">Documentary</Option>
            <Option value="drama">Drama</Option>
            <Option value="family">Family</Option>
            <Option value="fantasy">Fantasy</Option>
            <Option value="film-noir">Film-Noir</Option>
            <Option value="game-show">Game-Show</Option>
            <Option value="history">History</Option>
            <Option value="horror">Horror</Option>
            <Option value="music">Music</Option>
            <Option value="musical">Musical</Option>
            <Option value="mystery">Mystery</Option>
            <Option value="news">News</Option>
            <Option value="reality-tv">Reality-TV</Option>
            <Option value="romance">Romance</Option>
            <Option value="sci-fi">Sci-Fi</Option>
            <Option value="short">Short</Option>
            <Option value="sport">Sport</Option>
            <Option value="talk-show">Talk-Show</Option>
            <Option value="thriller">Thriller</Option>
            <Option value="war">War</Option>
            <Option value="western">Western</Option>
          </Select>
          <Select
            placeholder="Region"
            onChange={handleRegionChange}
            style={{ marginRight: 70, width: '20%' }}
          >
            <Option value=""></Option>
            <Option value="Afghanistan">Afghanistan</Option>
            <Option value="Albania">Albania</Option>
            <Option value="Algeria">Algeria</Option>
            <Option value="Andorra">Andorra</Option>
            <Option value="Angola">Angola</Option>
            <Option value="Antarctica">Antarctica</Option>
            <Option value="Argentina">Argentina</Option>
            <Option value="Armenia">Armenia</Option>
            <Option value="Aruba">Aruba</Option>
            <Option value="Australia">Australia</Option>
            <Option value="Austria">Austria</Option>
            <Option value="Azerbaijan">Azerbaijan</Option>
            <Option value="Bahamas">Bahamas</Option>
            <Option value="Bahrain">Bahrain</Option>
            <Option value="Bangladesh">Bangladesh</Option>
            <Option value="Barbados">Barbados</Option>
            <Option value="Belarus">Belarus</Option>
            <Option value="Belgium">Belgium</Option>
            <Option value="Belize">Belize</Option>
            <Option value="Benin">Benin</Option>
            <Option value="Bermuda">Bermuda</Option>
            <Option value="Bhutan">Bhutan</Option>
            <Option value="Bolivia">Bolivia</Option>
            <Option value="Bosnia and Herzegovina">Bosnia and Herzegovina</Option>
            <Option value="Botswana">Botswana</Option>
            <Option value="Brazil">Brazil</Option>
            <Option value="Brunei">Brunei</Option>
            <Option value="Bulgaria">Bulgaria</Option>
            <Option value="Burkina Faso">Burkina Faso</Option>
            <Option value="Burma">Burma</Option>
            <Option value="Burundi">Burundi</Option>
            <Option value="Cambodia">Cambodia</Option>
            <Option value="Cameroon">Cameroon</Option>
            <Option value="Canada">Canada</Option>
            <Option value="Cape Verde">Cape Verde</Option>
            <Option value="Cayman Islands">Cayman Islands</Option>
            <Option value="Central African Republic">Central African Republic</Option>
            <Option value="Chad">Chad</Option>
            <Option value="Chile">Chile</Option>
            <Option value="China">China</Option>
            <Option value="Colombia">Colombia</Option>
            <Option value="Comoros">Comoros</Option>
            <Option value="Congo">Congo</Option>
            <Option value="Cook Islands">Cook Islands</Option>
            <Option value="Costa Rica">Costa Rica</Option>
            <Option value="Croatia">Croatia</Option>
            <Option value="Cuba">Cuba</Option>
            <Option value="Curaçao">Curaçao</Option>
            <Option value="Cyprus">Cyprus</Option>
            <Option value="Czech Republic">Czech Republic</Option>
            <Option value="Czechoslovakia">Czechoslovakia</Option>
            <Option value="Côte d'Ivoire">Côte d'Ivoire</Option>
            <Option value="Denmark">Denmark</Option>
            <Option value="Djibouti">Djibouti</Option>
            <Option value="Dominican Republic">Dominican Republic</Option>
            <Option value="East Germany">East Germany</Option>
            <Option value="Ecuador">Ecuador</Option>
            <Option value="Egypt">Egypt</Option>
            <Option value="El Salvador">El Salvador</Option>
            <Option value="Equatorial Guinea">Equatorial Guinea</Option>
            <Option value="Eritrea">Eritrea</Option>
            <Option value="Estonia">Estonia</Option>
            <Option value="Ethiopia">Ethiopia</Option>
            <Option value="Faroe Islands">Faroe Islands</Option>
            <Option value="Federal Republic of Yugoslavia">Federal Republic of Yugoslavia</Option>
            <Option value="Fiji">Fiji</Option>
            <Option value="Finland">Finland</Option>
            <Option value="France">France</Option>
            <Option value="French Guiana">French Guiana</Option>
            <Option value="French Polynesia">French Polynesia</Option>
            <Option value="Gabon">Gabon</Option>
            <Option value="Georgia">Georgia</Option>
            <Option value="Germany">Germany</Option>
            <Option value="Ghana">Ghana</Option>
            <Option value="Greece">Greece</Option>
            <Option value="Greenland">Greenland</Option>
            <Option value="Guadeloupe">Guadeloupe</Option>
            <Option value="Guam">Guam</Option>
            <Option value="Guatemala">Guatemala</Option>
            <Option value="Guinea">Guinea</Option>
            <Option value="Guinea-Bissau">Guinea-Bissau</Option>
            <Option value="Guyana">Guyana</Option>
            <Option value="Haiti">Haiti</Option>
            <Option value="Honduras">Honduras</Option>
            <Option value="Hong Kong">Hong Kong</Option>
            <Option value="Hungary">Hungary</Option>
            <Option value="Iceland">Iceland</Option>
            <Option value="India">India</Option>
            <Option value="Indonesia">Indonesia</Option>
            <Option value="Iran">Iran</Option>
            <Option value="Iraq">Iraq</Option>
            <Option value="Ireland">Ireland</Option>
            <Option value="Isle of Man">Isle of Man</Option>
            <Option value="Israel">Israel</Option>
            <Option value="Italy">Italy</Option>
            <Option value="Jamaica">Jamaica</Option>
            <Option value="Japan">Japan</Option>
            <Option value="Jordan">Jordan</Option>
            <Option value="Kazakhstan">Kazakhstan</Option>
            <Option value="Kenya">Kenya</Option>
            <Option value="Korea">Korea</Option>
            <Option value="Kosovo">Kosovo</Option>
            <Option value="Kuwait">Kuwait</Option>
            <Option value="Kyrgyzstan">Kyrgyzstan</Option>
            <Option value="Laos">Laos</Option>
            <Option value="Latvia">Latvia</Option>
            <Option value="Lebanon">Lebanon</Option>
            <Option value="Lesotho">Lesotho</Option>
            <Option value="Liberia">Liberia</Option>
            <Option value="Libya">Libya</Option>
            <Option value="Liechtenstein">Liechtenstein</Option>
            <Option value="Lithuania">Lithuania</Option>
            <Option value="Luxembourg">Luxembourg</Option>
            <Option value="Macao">Macao</Option>
            <Option value="Madagascar">Madagascar</Option>
            <Option value="Malawi">Malawi</Option>
            <Option value="Malaysia">Malaysia</Option>
            <Option value="Maldiv">Maldiv</Option>
            <Option value="Maldives">Maldives</Option>
            <Option value="Mali">Mali</Option>
            <Option value="Malta">Malta</Option>
            <Option value="Marshall Islands">Marshall Islands</Option>
            <Option value="Martinique">Martinique</Option>
            <Option value="Mauritania">Mauritania</Option>
            <Option value="Mauritius">Mauritius</Option>
            <Option value="Mexico">Mexico</Option>
            <Option value="Micronesia">Micronesia</Option>
            <Option value="Moldova">Moldova</Option>
            <Option value="Monaco">Monaco</Option>
            <Option value="Mongolia">Mongolia</Option>
            <Option value="Montenegro">Montenegro</Option>
            <Option value="Morocco">Morocco</Option>
            <Option value="Mozambique">Mozambique</Option>
            <Option value="Myanmar">Myanmar</Option>
            <Option value="Namibia">Namibia</Option>
            <Option value="Nepal">Nepal</Option>
            <Option value="Netherlands">Netherlands</Option>
            <Option value="Netherlands Antilles">Netherlands Antilles</Option>
            <Option value="New Caledonia">New Caledonia</Option>
            <Option value="New Zealand">New Zealand</Option>
            <Option value="Nicaragua">Nicaragua</Option>
            <Option value="Niger">Niger</Option>
            <Option value="Nigeria">Nigeria</Option>
            <Option value="North Korea">North Korea</Option>
            <Option value="North Macedonia">North Macedonia</Option>
            <Option value="North Vietnam">North Vietnam</Option>
            <Option value="Norway">Norway</Option>
            <Option value="Occupied Palestinian Territory">Occupied Palestinian Territory</Option>
            <Option value="Oman">Oman</Option>
            <Option value="Pakistan">Pakistan</Option>
            <Option value="Palau">Palau</Option>
            <Option value="Palestine">Palestine</Option>
            <Option value="Panama">Panama</Option>
            <Option value="Papua New Guinea">Papua New Guinea</Option>
            <Option value="Paraguay">Paraguay</Option>
            <Option value="Peru">Peru</Option>
            <Option value="Philippines">Philippines</Option>
            <Option value="Poland">Poland</Option>
            <Option value="Portugal">Portugal</Option>
            <Option value="Puerto Rico">Puerto Rico</Option>
            <Option value="Qatar">Qatar</Option>
            <Option value="Republic of Macedonia">Republic of Macedonia</Option>
            <Option value="Republic of North Macedonia">Republic of North Macedonia</Option>
            <Option value="Reunion">Reunion</Option>
            <Option value="Romania">Romania</Option>
            <Option value="Russia">Russia</Option>
            <Option value="Rwanda">Rwanda</Option>
            <Option value="Saint Lucia">Saint Lucia</Option>
            <Option value="Samoa">Samoa</Option>
            <Option value="San Marino">San Marino</Option>
            <Option value="Sao Tome and Principe">Sao Tome and Principe</Option>
            <Option value="Saudi Arabia">Saudi Arabia</Option>
            <Option value="Senegal">Senegal</Option>
            <Option value="Serbia">Serbia</Option>
            <Option value="Serbia and Montenegro">Serbia and Montenegro</Option>
            <Option value="Sierra Leone">Sierra Leone</Option>
            <Option value="Singapore">Singapore</Option>
            <Option value="Slovakia">Slovakia</Option>
            <Option value="Slovenia">Slovenia</Option>
            <Option value="Somalia">Somalia</Option>
            <Option value="South Africa">South Africa</Option>
            <Option value="South Africa,">South Africa,</Option>
            <Option value="South Korea">South Korea</Option>
            <Option value="Soviet Union">Soviet Union</Option>
            <Option value="Spain">Spain</Option>
            <Option value="Sri Lanka">Sri Lanka</Option>
            <Option value="Sudan">Sudan</Option>
            <Option value="Suriname">Suriname</Option>
            <Option value="Swaziland">Swaziland</Option>
            <Option value="Sweden">Sweden</Option>
            <Option value="Switzerland">Switzerland</Option>
            <Option value="Syria">Syria</Option>
            <Option value="Taiwan">Taiwan</Option>
            <Option value="Tajikistan">Tajikistan</Option>
            <Option value="Tanzania">Tanzania</Option>
            <Option value="Thailand">Thailand</Option>
            <Option value="The Democratic Republic Of Congo">The Democratic Republic Of Congo</Option>
            <Option value="The Democratic Republic of Congo">The Democratic Republic of Congo</Option>
            <Option value="Timor-Leste">Timor-Leste</Option>
            <Option value="Togo">Togo</Option>
            <Option value="Trinidad and Tobago">Trinidad and Tobago</Option>
            <Option value="Tunisia">Tunisia</Option>
            <Option value="Turkey">Turkey</Option>
            <Option value="Turkmenistan">Turkmenistan</Option>
            <Option value="UK">UK</Option>
            <Option value="USA">USA</Option>
            <Option value="Uganda">Uganda</Option>
            <Option value="Ukraine">Ukraine</Option>
            <Option value="United Ara">United Ara</Option>
            <Option value="United Arab Emirates">United Arab Emirates</Option>
            <Option value="United Kingdo">United Kingdo</Option>
            <Option value="United Kingdom">United Kingdom</Option>
            <Option value="United States">United States</Option>
            <Option value="Uruguay">Uruguay</Option>
            <Option value="Uzbekistan">Uzbekistan</Option>
            <Option value="Vanuatu">Vanuatu</Option>
            <Option value="Vatican">Vatican</Option>
            <Option value="Venezuela">Venezuela</Option>
            <Option value="Vietnam">Vietnam</Option>
            <Option value="West Germany">West Germany</Option>
            <Option value="Western Sahara">Western Sahara</Option>
            <Option value="Yemen">Yemen</Option>
            <Option value="Yugoslavia">Yugoslavia</Option>
            <Option value="Zaire">Zaire</Option>
            <Option value="Zambia">Zambia</Option>
            <Option value="Zimbabwe">Zimbabwe</Option>
          </Select>
          <Checkbox
            style={{ marginLeft: 10 }}
            checked={awarded === true}
            onChange={() => handleAwardedChange(awarded === true ? "" : true)}
          >
            <strong>Oscar Awarded</strong>
          </Checkbox>
          <Checkbox
            style={{ marginLeft: 10 }}
            checked={nominated === true}
            onChange={() => handleNominatedChange(nominated === true ? "" : true)}
          >
            <strong>Oscar Nominated</strong>
          </Checkbox>
          <Checkbox
            style={{ marginRight: 10 }}
            checked={rated === true}
            onChange={() => handleRatedChange(rated === true ? "" : true)}
          >
            <strong>Rated</strong>
          </Checkbox>
        </div>
        <div style={{ width: '40%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <div>
            <label><strong>Rating between</strong>: {ratingMin} ~ {ratingMax}</label>
            <Slider
              range
              min={0}
              max={10.0}
              step={0.1}
              defaultValue={[ratingMin, ratingMax]}
              onChange={handleRatingChange}
              style={{ width: 400 }}
            />
          </div>
          <div>
            <label><strong>Runtime between</strong>: {runtimeMin} min ~ {runtimeMax} min</label>
            <Slider
              range
              min={0}
              max={300}
              step={1}
              defaultValue={[runtimeMin, runtimeMax]}
              onChange={handleRuntimeChange}
              style={{ width: 400 }}
            />
          </div>
          <div>
            <label><strong>Released between:</strong> {releaseYearMin} ~ {releaseYearMax}</label>
            <Slider
              range
              min={1900}
              max={2025}
              step={1}
              defaultValue={[releaseYearMin, releaseYearMax]}
              onChange={handleReleaseYearChange}
              style={{ width: 400 }}
            />
          </div>
        </div>
      </div>
      <Button style={{ marginRight: 15, width: 200 }} type="primary" onClick={handleConfirmClick}>
        Search
      </Button>
    </div >
  )
}

export default MovieFilter
