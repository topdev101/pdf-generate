const Data = require('../models/dataModel');
const { PDFDocument } = require('pdf-lib');
const fs = require('fs');

const dateFormatter = (date) => {
    const position = date.search("/");
    if(position>-1){
      return date
    } else {
      const formatte = date.split(":");
      const [year, month, day] = formatte[0].split("-");
      return [month, day, year].join("/");
    }

};

const pdfDownload130 = async (req, res) => {

    const existingPdfBytes = fs.readFileSync(`${__dirname}/pdf_forms/i-130.pdf`);
    console.log(existingPdfBytes);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const form = pdfDoc.getForm();
    //temp
    const fields = form.getFields();
    fields.forEach((field) => {
      const name = field.getName();
      console.log(`${name}`);
    });
    //temp
    Data.findOne({
      _id: req.params.user_id,
    }).exec(async function (err, user) {
      console.log(user);
      if (user) {
        // What's JERRY's full legal name?

        if (user.data.application.family_name) {
          form
            .getTextField("form1[0].#subform[0].Pt2Line4a_FamilyName[0]")
            .setText(user.data.application.family_name?.toUpperCase());
        }

        if (user.data.application.name) {
          form
            .getTextField("form1[0].#subform[0].Pt2Line4b_GivenName[0]")
            .setText(user.data.application.name?.toUpperCase());
        }

        if (user.data.application.middle_name) {
          form
            .getTextField("form1[0].#subform[0].Pt2Line4c_MiddleName[0]")
            .setText(user.data.application.middle_name?.toUpperCase());
        }

        //Has JERRY ever used names other than "JERRY " since birth?

        let names = "";
        for (var i = 0; i < user.data.application.other_names.length; i++) {
          names +=
            ((names && ", ") || "") +
              user.data.application.other_names[i].subfirstname_name &&
            user.data.application.other_names[i].submiddlename_name &&
            user.data.application.other_names[i].sublastname_name;

          if (user.data.application.other_names[i].sublastname_name) {
            form
              .getTextField("form1[0].#subform[1].Pt2Line5a_FamilyName[0]")
              .setText(
                user.data.application.other_names[
                  i
                ].sublastname_name?.toUpperCase()
              );
          }

          if (user.data.application.other_names[i].subfirstname_name) {
            form
              .getTextField("form1[0].#subform[1].Pt2Line5b_GivenName[0]")
              .setText(
                user.data.application.other_names[
                  i
                ].subfirstname_name?.toUpperCase()
              );
          }
          if (user.data.application.other_names[i].submiddlename_name) {
            form
              .getTextField("form1[0].#subform[1].Pt2Line5c_MiddleName[0]")
              .setText(
                user.data.application.other_names[
                  i
                ].submiddlename_name?.toUpperCase()
              );
          }
        }

        // Enter JERRY's name in JERRY's native written language:

        if (user.data.application.subsublastnames_name) {
          form
            .getTextField("form1[0].#subform[7].Pt4Line55a_FamilyName[0]")
            .setText(user.data.application.subsublastnames_name?.toUpperCase());
        }

        if (user.data.application.subfirstnames_name) {
          form
            .getTextField("form1[0].#subform[7].Pt4Line55b_GivenName[0]")
            .setText(user.data.application.subfirstnames_name?.toUpperCase());
        }

        if (user.data.application.subsubmiddlenames_name) {
          form
            .getTextField("form1[0].#subform[7].Pt4Line55c_MiddleName[0]")
            .setText(
              user.data.application.subsubmiddlenames_name?.toUpperCase()
            );
        }

        // OTHER NAME

        if (Array.isArray(user.data.application.sponsorform_names)) {
          if (user.data.application.sponsorform_names.length > 0) {
            if (
              user.data.application.sponsorform_names[0].sponsorsublastname_name
            ) {
              form
                .getTextField("form1[0].#subform[1].Pt2Line5a_FamilyName[0]")
                .setText(
                  user.data.application.sponsorform_names[0].sponsorsublastname_name?.toUpperCase()
                );
            }

            if (
              user.data.application.sponsorform_names[0]
                .sponsorsubfirstname_name
            ) {
              form
                .getTextField("form1[0].#subform[1].Pt2Line5b_GivenName[0]")
                .setText(
                  user.data.application.sponsorform_names[0].sponsorsubfirstname_name?.toUpperCase()
                );
            }

            if (
              user.data.application.sponsorform_names[0]
                .sponsorsubmiddlename_name
            ) {
              form
                .getTextField("form1[0].#subform[1].Pt2Line5c_MiddleName[0]")
                .setText(
                  user.data.application.sponsorform_names[0].sponsorsubmiddlename_name?.toUpperCase()
                );
            }
          }
        }

        // Some basic info about JERRY

        // Sex

        if (user.data.application.sponsorbasicinfo_name == "Female") {
          form.getCheckBox("form1[0].#subform[1].Pt2Line9_Female[0]").check();
        } else {
          form.getCheckBox("form1[0].#subform[1].Pt2Line9_Female[0]").uncheck();
        }
        if (user.data.application.sponsorbasicinfo_name == "Male") {
          form.getCheckBox("form1[0].#subform[1].Pt2Line9_Male[0]").check();
        } else {
          form.getCheckBox("form1[0].#subform[1].Pt2Line9_Male[0]").uncheck();
        }

        // us inside

        if (
          user.data.application.sponsoradministrationcheck_name ==
          "Birth in the United States"
        ) {
          form
            .getCheckBox("form1[0].#subform[2].Pt2Line23a_checkbox[0]")
            .check();
        } else {
          form
            .getCheckBox("form1[0].#subform[2].Pt2Line23a_checkbox[0]")
            .uncheck();
        }
        if (
          user.data.application.sponsoradministrationcheck_name ==
          "Naturalization"
        ) {
          form
            .getCheckBox("form1[0].#subform[2].Pt2Line23b_checkbox[0]")
            .check();
        } else {
          form
            .getCheckBox("form1[0].#subform[2].Pt2Line23b_checkbox[0]")
            .uncheck();
        }
        if (
          user.data.application.sponsoradministrationcheck_name == "Parents"
        ) {
          form
            .getCheckBox("form1[0].#subform[2].Pt2Line23c_checkbox[0]")
            .check();
        } else {
          form
            .getCheckBox("form1[0].#subform[2].Pt2Line23c_checkbox[0]")
            .uncheck();
        }

        // Street number and name

        if (user.data.application.physicalstreet_name) {
          form
            .getTextField("form1[0].#subform[7].Pt4Line56_StreetNumberName[0]")
            .setText(
              user.data.application.physicalstreet_name
                ?.toUpperCase()
                ?.slice(0, 34)
            );
        }

        // Apt./Ste./Flr. Number (if any)

        if (user.data.application.physicalapt_name === "Apt.") {
          form.getCheckBox("form1[0].#subform[7].Pt4Line56_Unit[0]").check();
        } else {
          form.getCheckBox("form1[0].#subform[7].Pt4Line56_Unit[0]").uncheck();
        }

        if (user.data.application.physicalapt_name === "Ste.") {
          form.getCheckBox("form1[0].#subform[7].Pt4Line56_Unit[1]").check();
        } else {
          form.getCheckBox("form1[0].#subform[7].Pt4Line56_Unit[1]").uncheck();
        }

        if (user.data.application.physicalapt_name === "Flr.") {
          form.getCheckBox("form1[0].#subform[7].Pt4Line56_Unit[2]").check();
        } else {
          form.getCheckBox("form1[0].#subform[7].Pt4Line56_Unit[2]").uncheck();
        }

        if (user.data.application.physicalste_name) {
          form
            .getTextField("form1[0].#subform[7].Pt4Line56_AptSteFlrNumber[0]")
            .setText(
              user.data.application.physicalste_name?.toUpperCase().slice(0, 5)
            );
        }

        // City or town

        if (user.data.application.physicalcity_name) {
          form
            .getTextField("form1[0].#subform[7].Pt4Line56_CityOrTown[0]")
            .setText(
              user.data.application.physicalcity_name
                ?.toUpperCase()
                .slice(0, 20)
            );
        }

        // State

        if (user.data.application.physicalprovince_name) {
          form
            .getDropdown("form1[0].#subform[1].Pt2Line10_State[0]")
            .select(user.data.application.physicalprovince_name?.toUpperCase());
        }

        // ZIP code

        if (user.data.application.physicalpostalcode_name) {
          form
            .getTextField("form1[0].#subform[1].Pt2Line10_ZipCode[0]")
            .setText(user.data.application.physicalpostalcode_name.slice(0, 5));
        }

        // Province

        if (user.data.application.physicalprovince_name) {
          form
            .getTextField("form1[0].#subform[7].Pt4Line56_Province[0]")
            .setText(
              user.data.application.physicalprovince_name?.toUpperCase()
            );
        }

        // Postal code

        if (user.data.application.physicalpostalcode_name) {
          form
            .getTextField("form1[0].#subform[7].Pt4Line56_PostalCode[0]")
            .setText(
              user.data.application.physicalpostalcode_name?.toUpperCase()
            );
        }

        // Country

        if (user.data.application.physicaladdress_name === "USA") {
          form
            .getTextField("form1[0].#subform[7].Pt4Line56_Country[0]")
            .setText("USA");
        } else if (user.data.application.physicalcountry_name) {
          form
            .getTextField("form1[0].#subform[7].Pt4Line56_Country[0]")
            .setText(user.data.application.physicalcountry_name?.toUpperCase());
        }

        // us inside  address outside the U.S.
        // Street number and name

        if (user.data.application.physicalstreet_name) {
          form
            .getTextField("form1[0].#subform[4].Pt4Line13_StreetNumberName[0]")
            .setText(
              user.data.application.physicalstreet_name
                ?.toUpperCase()
                .slice(0, 34)
            );
        }

        // Apt./Ste./Flr. Number (if any)

        if (user.data.application.physicalapt_name === "Apt.") {
          form.getCheckBox("form1[0].#subform[4].Pt4Line13_Unit[0]").check();
        } else {
          form.getCheckBox("form1[0].#subform[4].Pt4Line13_Unit[0]").uncheck();
        }

        if (user.data.application.physicalapt_name === "Ste.") {
          form.getCheckBox("form1[0].#subform[4].Pt4Line13_Unit[1]").check();
        } else {
          form.getCheckBox("form1[0].#subform[4].Pt4Line13_Unit[1]").uncheck();
        }

        if (user.data.application.physicalapt_name === "Flr.") {
          form.getCheckBox("form1[0].#subform[4].Pt4Line13_Unit[2]").check();
        } else {
          form.getCheckBox("form1[0].#subform[4].Pt4Line13_Unit[2]").uncheck();
        }

        if (user.data.application.physicalste_name) {
          form
            .getTextField("form1[0].#subform[4].Pt4Line13_AptSteFlrNumber[0]")
            .setText(
              user.data.application.physicalste_name?.toUpperCase().slice(0, 5)
            );
        }

        // City or town

        if (user.data.application.physicalcity_name) {
          form
            .getTextField("form1[0].#subform[4].Pt4Line13_CityOrTown[0]")
            .setText(
              user.data.application.physicalcity_name
                ?.toUpperCase()
                .slice(0, 20)
            );
        }

        // State

        if (user.data.application.physicalprovince_name) {
          form
            .getDropdown("form1[0].#subform[1].Pt2Line10_State[0]")
            .select(user.data.application.physicalprovince_name?.toUpperCase());
        }

        // ZIP code

        if (user.data.application.physicalpostalcode_name) {
          form
            .getTextField("form1[0].#subform[1].Pt2Line10_ZipCode[0]")
            .setText(user.data.application.physicalpostalcode_name.slice(0, 5));
        }

        // Province

        if (user.data.application.physicalprovince_name) {
          form
            .getTextField("form1[0].#subform[4].Pt4Line13_Province[0]")
            .setText(
              user.data.application.physicalprovince_name?.toUpperCase()
            );
        }

        // Postal code

        if (user.data.application.physicalpostalcode_name) {
          form
            .getTextField("form1[0].#subform[4].Pt4Line13_PostalCode[0]")
            .setText(
              user.data.application.physicalpostalcode_name?.toUpperCase()
            );
        }

        // Country

        if (user.data.application.physicaladdress_name === "USA") {
          form
            .getTextField("form1[0].#subform[4].Pt4Line13_Country[0]")
            .setText("USA");
        } else if (user.data.application.physicalcountry_name) {
          form
            .getTextField("form1[0].#subform[4].Pt4Line13_Country[0]")
            .setText(user.data.application.physicalcountry_name?.toUpperCase());
        }

        // In care of name (if any)

        if (user.data.application.insponsorincare_name) {
          form
            .getTextField("form1[0].#subform[1].Pt2Line10_InCareofName[0]")
            .setText(user.data.application.insponsorincare_name?.toUpperCase());
        }

        // Street number and name

        if (user.data.application.inphysicalstreetsponsor_name) {
          form
            .getTextField("form1[0].#subform[1].Pt2Line10_StreetNumberName[0]")
            .setText(
              user.data.application.inphysicalstreetsponsor_name
                ?.toUpperCase()
                ?.slice(0, 34)
            );
        }

        // Apt./Ste./Flr. Number (if any)

        if (user.data.application.physicalusaptsponsor_name == "Apt") {
          form.getCheckBox("form1[0].#subform[1].Pt2Line10_Unit[0]").check();
        } else {
          form.getCheckBox("form1[0].#subform[1].Pt2Line10_Unit[0]").uncheck();
        }

        if (user.data.application.physicalusaptsponsor_name == "Ste") {
          form.getCheckBox("form1[0].#subform[1].Pt2Line10_Unit[1]").check();
        } else {
          form.getCheckBox("form1[0].#subform[1].Pt2Line10_Unit[1]").uncheck();
        }

        if (user.data.application.physicalusaptsponsor_name == "Flr") {
          form.getCheckBox("form1[0].#subform[1].Pt2Line10_Unit[2]").check();
        } else {
          form.getCheckBox("form1[0].#subform[1].Pt2Line10_Unit[2]").uncheck();
        }

        // if (user.data.application.physicalusstesponsor_name) {
        //   form
        //     .getTextField("form1[0].#subform[1].Pt2Line10_AptSteFlrNumber[0]")
        //     .setText(
        //       user.data.application.physicalusstesponsor_name?.toUpperCase()
        //     );
        // }

        // City or town

        if (user.data.application.physicalcitysponsorus_name) {
          form
            .getTextField("form1[0].#subform[1].Pt2Line10_CityOrTown[0]")
            .setText(
              user.data.application.physicalcitysponsorus_name?.toUpperCase()
            );
        }

        // State

        if (user.data.application.physicalusprovincesponsorin_name) {
          form
            .getDropdown("form1[0].#subform[1].Pt2Line10_State[0]")
            .select(
              user.data.application.physicalusprovincesponsorin_name?.toUpperCase()
            );
        }

        // ZIP code

        if (user.data.application.usinsidezipcode_name) {
          form
            .getTextField("form1[0].#subform[1].Pt2Line10_ZipCode[0]")
            .setText(user.data.application.usinsidezipcode_name);
        }

        // Province

        if (user.data.application.provinceusinside_name) {
          form
            .getTextField("form1[0].#subform[1].Pt2Line10_Province[0]")
            .setText(
              user.data.application.provinceusinside_name?.toUpperCase()
            );
        }

        // Postal code

        if (user.data.application.postalcodeinsideus_name) {
          form
            .getTextField("form1[0].#subform[1].Pt2Line10_PostalCode[0]")
            .setText(
              user.data.application.postalcodeinsideus_name?.toUpperCase()
            );
        }

        // Country
        if (user.data.application.sponsortypeaddress_name === "USA") {
          form
            .getTextField("form1[0].#subform[1].Pt2Line10_Country[0]")
            .setText("USA");
        } else if (user.data.application.insidecountrysponsorus_name) {
          form
            .getTextField("form1[0].#subform[1].Pt2Line10_Country[0]")
            .setText(
              user.data.application.insidecountrysponsorus_name?.toUpperCase()
            );
        }

        if (user.data.application.sponsorphysicaladdress_name === "yes") {
          // Street number and name

          if (user.data.application.inphysicalstreetsponsor_name) {
            form
              .getTextField(
                "form1[0].#subform[1].Pt2Line12_StreetNumberName[0]"
              )
              .setText(
                user.data.application.inphysicalstreetsponsor_name?.toUpperCase()
              );
          }

          // Apt./Ste./Flr. Number (if any)

          if (user.data.application.physicalusaptsponsor_name == "Apt") {
            form.getCheckBox("form1[0].#subform[1].Pt2Line12_Unit[0]").check();
          } else {
            form
              .getCheckBox("form1[0].#subform[1].Pt2Line12_Unit[0]")
              .uncheck();
          }

          if (user.data.application.physicalusaptsponsor_name == "Ste") {
            form.getCheckBox("form1[0].#subform[1].Pt2Line12_Unit[1]").check();
          } else {
            form
              .getCheckBox("form1[0].#subform[1].Pt2Line12_Unit[1]")
              .uncheck();
          }

          if (user.data.application.physicalusaptsponsor_name == "Flr") {
            form.getCheckBox("form1[0].#subform[1].Pt2Line12_Unit[2]").check();
          } else {
            form
              .getCheckBox("form1[0].#subform[1].Pt2Line12_Unit[2]")
              .uncheck();
          }

          if (user.data.application.physicalusstesponsor_name) {
            form
              .getTextField("form1[0].#subform[1].Pt2Line12_AptSteFlrNumber[0]")
              .setText(user.data.application.physicalusstesponsor_name);
          }

          // City or town

          if (user.data.application.physicalcitysponsorus_name) {
            form
              .getTextField("form1[0].#subform[1].Pt2Line12_CityOrTown[0]")
              .setText(
                user.data.application.physicalcitysponsorus_name?.toUpperCase()
              );
          }

          // State

          if (user.data.application.physicalusprovincesponsorin_name) {
            form
              .getDropdown("form1[0].#subform[1].Pt2Line12_State[0]")
              .select(user.data.application.physicalusprovincesponsorin_name);
          }

          // ZIP code

          if (user.data.application.usinsidezipcode_name) {
            form
              .getTextField("form1[0].#subform[1].Pt2Line12_ZipCode[0]")
              .setText(
                user.data.application.usinsidezipcode_name?.toUpperCase()
              );
          }

          // Province

          if (user.data.application.provinceusinside_name) {
            form
              .getTextField("form1[0].#subform[1].Pt2Line12_Province[0]")
              .setText(
                user.data.application.provinceusinside_name?.toUpperCase()
              );
          }

          // Postal code

          if (user.data.application.postalcodeinsideus_name) {
            form
              .getTextField("form1[0].#subform[1].Pt2Line12_PostalCode[0]")
              .setText(user.data.application.postalcodeinsideus_name);
          }

          // Country

          if (user.data.application.physicaladdresssponsor_name === "USA") {
            form
              .getTextField("form1[0].#subform[1].Pt2Line12_Country[0]")
              .setText("USA");
          }

          if (user.data.application.insidecountrysponsorus_name) {
            form
              .getTextField("form1[0].#subform[1].Pt2Line12_Country[0]")
              .setText(
                user.data.application.insidecountrysponsorus_name?.toUpperCase()
              );
          }

           if (user.data.application.currentphysicaladdress_name) {
            form
              .getTextField("form1[0].#subform[1].Pt2Line13a_DateFrom[0]")
              .setText(
                dateFormatter(user.data.application.currentphysicaladdress_name)
              );
          }
        }

        if (user.data.application.signaturedate_name) {
          form
            .getTextField("form1[0].#subform[8].Pt6Line6b_DateofSignature[0]")
            .setText(dateFormatter(user.data.application.signaturedate_name));
        }

        if (user.data.application.uslastarrival_name) {
          form
            .getTextField("form1[0].#subform[6].Pt4Line21c_DateOfArrival[0]")
            .setText(dateFormatter(user.data.application.uslastarrival_name));
        }

        if (user.data.application.sponsorphysicaladdress_name === "no") {
          // Street number and name

          if (user.data.application.streetsponsorandname_name) {
            form
              .getTextField(
                "form1[0].#subform[1].Pt2Line12_StreetNumberName[0]"
              )
              .setText(
                user.data.application.streetsponsorandname_name?.toUpperCase()
              );
          }

          // Apt./Ste./Flr. Number (if any)

          if (user.data.application.physicalaptsponsor_name == "Apt") {
            form.getCheckBox("form1[0].#subform[1].Pt2Line12_Unit[0]").check();
          } else {
            form
              .getCheckBox("form1[0].#subform[1].Pt2Line12_Unit[0]")
              .uncheck();
          }

          if (user.data.application.physicalaptsponsor_name == "Ste") {
            form.getCheckBox("form1[0].#subform[1].Pt2Line12_Unit[1]").check();
          } else {
            form
              .getCheckBox("form1[0].#subform[1].Pt2Line12_Unit[1]")
              .uncheck();
          }

          if (user.data.application.physicalaptsponsor_name == "Flr") {
            form.getCheckBox("form1[0].#subform[1].Pt2Line12_Unit[2]").check();
          } else {
            form
              .getCheckBox("form1[0].#subform[1].Pt2Line12_Unit[2]")
              .uncheck();
          }

          if (user.data.application.physicalstesponsore_name) {
            form
              .getTextField("form1[0].#subform[1].Pt2Line12_AptSteFlrNumber[0]")
              .setText(user.data.application.physicalstesponsore_name);
          }

          // City or town

          if (user.data.application.placemailingcity_name) {
            form
              .getTextField("form1[0].#subform[1].Pt2Line12_CityOrTown[0]")
              .setText(
                user.data.application.placemailingcity_name?.toUpperCase()
              );
          }

          // State

          if (user.data.application.usmailingprovinceinside_name) {
            form
              .getDropdown("form1[0].#subform[1].Pt2Line12_State[0]")
              .select(user.data.application.usmailingprovinceinside_name);
          }

          // ZIP code

          if (user.data.application.mailingpostalcodezipin_name) {
            form
              .getTextField("form1[0].#subform[1].Pt2Line12_ZipCode[0]")
              .setText(
                user.data.application.mailingpostalcodezipin_name?.toUpperCase()
              );
          }

          // Province

          if (user.data.application.mailingprovinceinsi_name) {
            form
              .getTextField("form1[0].#subform[1].Pt2Line12_Province[0]")
              .setText(
                user.data.application.mailingprovinceinsi_name?.toUpperCase()
              );
          }

          // Postal code

          if (user.data.application.gpostalcodeinsidemailin_name) {
            form
              .getTextField("form1[0].#subform[1].Pt2Line12_PostalCode[0]")
              .setText(user.data.application.gpostalcodeinsidemailin_name);
          }

          // Country

          if (user.data.application.physicaladdresssponsor_name === "USA") {
            form
              .getTextField("form1[0].#subform[1].Pt2Line12_Country[0]")
              .setText("USA");
          } else if (user.data.application.placemailingcountry_name) {
            form
              .getTextField("form1[0].#subform[1].Pt2Line12_Country[0]")
              .setText(
                user.data.application.placemailingcountry_name?.toUpperCase()
              );
          }

          if (user.data.application.physicaltypeofaddresssponsor_name) {
            form
              .getTextField("form1[0].#subform[1].Pt2Line13a_DateFrom[0]")
              .setText(
                dateFormatter(
                  user.data.application.physicaltypeofaddresssponsor_name
                )
              );
          }
        }

        if (user.data.application.physicaladdressesus_names.length > 0) {
          // Street number and name

          if (
            user.data.application.physicaladdressesus_names[0]
              .streettogethersponsor_name
          ) {
            form
              .getTextField(
                "form1[0].#subform[1].Pt2Line14_StreetNumberName[0]"
              )
              .setText(
                user.data.application.physicaladdressesus_names[0].streettogethersponsor_name?.toUpperCase()
              );
          }

          // Apt./Ste./Flr. Number (if any)

          if (
            user.data.application.physicaladdressesus_names[0]
              .togethersponsorss_name == "Apt"
          ) {
            form.getCheckBox("form1[0].#subform[1].Pt2Line14_Unit[0]").check();
          } else {
            form
              .getCheckBox("form1[0].#subform[1].Pt2Line14_Unit[0]")
              .uncheck();
          }

          if (
            user.data.application.physicaladdressesus_names[0]
              .togethersponsorss_name == "Ste"
          ) {
            form.getCheckBox("form1[0].#subform[1].Pt2Line14_Unit[1]").check();
          } else {
            form
              .getCheckBox("form1[0].#subform[1].Pt2Line14_Unit[1]")
              .uncheck();
          }

          if (
            user.data.application.physicaladdressesus_names[0]
              .togethersponsorss_name == "Flr"
          ) {
            form.getCheckBox("form1[0].#subform[1].Pt2Line14_Unit[2]").check();
          } else {
            form
              .getCheckBox("form1[0].#subform[1].Pt2Line14_Unit[2]")
              .uncheck();
          }

          if (
            user.data.application.physicaladdressesus_names[0]
              .ssqstetogether_name
          ) {
            form
              .getTextField("form1[0].#subform[1].Pt2Line14_AptSteFlrNumber[0]")
              .setText(
                user.data.application.physicaladdressesus_names[0].ssqstetogether_name?.toUpperCase()
              );
          }

          // City or town

          if (
            user.data.application.physicaladdressesus_names[0].physicalcity_name
          ) {
            form
              .getTextField("form1[0].#subform[1].Pt2Line14_CityOrTown[0]")
              .setText(
                user.data.application.physicaladdressesus_names[0].physicalcity_name?.toUpperCase()
              );
          }

          // State

          if (
            user.data.application.physicaladdressesus_names[0]
              .physicalstate_name
          ) {
            form
              .getDropdown("form1[0].#subform[1].Pt2Line14_State[0]")
              .select(
                user.data.application.physicaladdressesus_names[0].physicalstate_name?.toUpperCase()
              );
          }

          // ZIP code

          if (
            user.data.application.physicaladdressesus_names[0].physicalzip_name
          ) {
            form
              .getTextField("form1[0].#subform[1].Pt2Line14_ZipCode[0]")
              .setText(
                user.data.application.physicaladdressesus_names[0].physicalzip_name?.toUpperCase()
              );
          }

          // Province

          if (
            user.data.application.physicaladdressesus_names[0]
              .physicalprovincee_name
          ) {
            form
              .getTextField("form1[0].#subform[1].Pt2Line14_Province[0]")
              .setText(
                user.data.application.physicaladdressesus_names[0].physicalprovincee_name?.toUpperCase()
              );
          }

          // Postal code

          if (
            user.data.application.physicaladdressesus_names[0].zipphysical_name
          ) {
            form
              .getTextField("form1[0].#subform[1].Pt2Line14_PostalCode[0]")
              .setText(
                user.data.application.physicaladdressesus_names[0].zipphysical_name?.toUpperCase()
              );
          }

          // Country

          if (
            user.data.application.physicaladdressesus_names[0]
              .togetheraddressphysical_name === "USA"
          ) {
            form
              .getTextField("form1[0].#subform[1].Pt2Line14_Country[0]")
              .setText("USA"?.toUpperCase());
          }
          if (
            user.data.application.physicaladdressesus_names[0]
              .countphysical_name
          ) {
            form
              .getTextField("form1[0].#subform[1].Pt2Line14_Country[0]")
              .setText(
                user.data.application.physicaladdressesus_names[0].countphysical_name?.toUpperCase()
              );
          }


          if (
            user.data.application.physicaladdressesus_names[0].moveindate_name
          ) {
            form
              .getTextField("form1[0].#subform[1].Pt2Line15a_DateFrom[0]")
              .setText(
                dateFormatter(
                  user.data.application.physicaladdressesus_names[0]
                    .moveindate_name
                )
              );
          }

          if (user.data.application.anumbersponsor_name) {
            form
              .getTextField("form1[0].#subform[11].Pt2Line1_AlienNumber[1]")
              .setText(user.data.application.anumbersponsor_name);
          }

          if (
            user.data.application.physicaladdressesus_names[0].moveoutdate_name
          ) {
            form
              .getTextField("form1[0].#subform[1].Pt2Line15b_DateTo[0]")
              .setText(
                dateFormatter(
                  user.data.application.physicaladdressesus_names[0]
                    .moveoutdate_name
                )
              );
          }
        }

        if (
          user.data.application?.physicaladdressesus_names[1]
            ?.streettogethersponsor_name
        ) {
          form
            .getTextField("form1[0].#subform[11].Pt9Line3a_PageNumber[0]")
            .setText("2");
        }

        if (
          user.data.application?.physicaladdressesus_names[1]
            ?.streettogethersponsor_name
        ) {
          form
            .getTextField("form1[0].#subform[11].Pt9Line3b_PartNumber[0]")
            .setText("2");
        }

        if (
          user.data.application?.physicaladdressesus_names[1]
            ?.streettogethersponsor_name
        ) {
          form
            .getTextField("form1[0].#subform[11].Pt9Line3c_ItemNumber[0]")
            .setText("12");
        }

        if (user.data.application.physicaladdressesus_names.length) {
          let srt = "";

          if (
            user.data.application.physicaladdressesus_names[1]
              ?.streettogethersponsor_name
          )
            // res.push(user.data.application.physicaladdressesus_names[1].streettogethersponsor_name)
            srt += `${user.data.application.physicaladdressesus_names[1].streettogethersponsor_name}, `;

          if (
            user.data.application.physicaladdressesus_names[1]
              ?.togethersponsorss_name
          )
            // res.push(user.data.application.physicaladdressesus_names[1].togethersponsorss_name)
            srt += `${user.data.application.physicaladdressesus_names[1].togethersponsorss_name} `;

          if (
            user.data.application.physicaladdressesus_names[1]
              ?.ssqstetogether_name
          )
            // res.push(user.data.application.physicaladdressesus_names[1].ssqstetogether_name)
            srt += `${user.data.application.physicaladdressesus_names[1].ssqstetogether_name}, `;

          if (
            user.data.application.physicaladdressesus_names[1]
              ?.physicalcity_name
          )
            // res.push(user.data.application.physicaladdressesus_names[1].physicalcity_name)
            srt += `${user.data.application.physicaladdressesus_names[1].physicalcity_name}, `;

          if (
            user.data.application.physicaladdressesus_names[1]
              ?.physicalprovincee_name
          )
            // res.push(user.data.application.physicaladdressesus_names[1].physicalprovincee_name)
            srt += `${user.data.application.physicaladdressesus_names[1].physicalprovincee_name}, `;

          if (
            user.data.application.physicaladdressesus_names[1]
              ?.physicalstate_name
          )
            // res.push(user.data.application.physicaladdressesus_names[1].physicalstate_name)
            srt += `${user.data.application.physicaladdressesus_names[1].physicalstate_name}, `;

          if (
            user.data.application.physicaladdressesus_names[1]?.zipphysical_name
          )
            // res.push(user.data.application.physicaladdressesus_names[1].zipphysical_name)
            srt += `${user.data.application.physicaladdressesus_names[1].zipphysical_name}, `;

          if (
            user.data.application.physicaladdressesus_names[1]?.physicalzip_name
          )
            // res.push(user.data.application.physicaladdressesus_names[1].physicalzip_name)
            srt += `${user.data.application.physicaladdressesus_names[1].physicalzip_name}, `;

          if (
            user.data.application.physicaladdressesus_names[1]
              ?.togetheraddressphysical_name === "USA"
          )
            // res.push(user.data.application.physicaladdressesus_names[1].togetheraddressphysical_name)
            srt += `${user.data.application.physicaladdressesus_names[1].togetheraddressphysical_name}, `;
          else if (
            user.data.application.physicaladdressesus_names[1]
              ?.togetheraddressphysical_name !== "USA" &&
            user.data.application.physicaladdressesus_names[1]
              ?.togetheraddressphysical_name.length
          )
            // res.push(user.data.application.physicaladdressesus_names[1]?.countphysical_name)
            srt += `${user.data.application.physicaladdressesus_names[1].countphysical_name}, `;

          if (
            user.data.application.physicaladdressesus_names[1]?.moveindate_name
          )
            // res.push(dateFormatter(user.data.application.physicaladdressesus_names[1].moveindate_name))
            srt += `${dateFormatter(
              user.data.application.physicaladdressesus_names[1].moveindate_name
            )} TO `;

          if (
            user.data.application.physicaladdressesus_names[1]?.moveoutdate_name
          )
            // res.push(dateFormatter(user.data.application.physicaladdressesus_names[1].moveoutdate_name))
            srt += `${dateFormatter(
              user.data.application.physicaladdressesus_names[1]
                .moveoutdate_name
            )} \n`;

          if (
            user.data.application.physicaladdressesus_names[2]
              ?.streettogethersponsor_name
          )
            // res.push(user.data.application.physicaladdressesus_names[1].streettogethersponsor_name)
            srt += `${user.data.application.physicaladdressesus_names[2]?.streettogethersponsor_name}, `;

          if (
            user.data.application.physicaladdressesus_names[2]
              ?.togethersponsorss_name
          )
            // res.push(user.data.application.physicaladdressesus_names[1].togethersponsorss_name)
            srt += `${user.data.application.physicaladdressesus_names[2]?.togethersponsorss_name} `;

          if (
            user.data.application.physicaladdressesus_names[2]
              ?.ssqstetogether_name
          )
            // res.push(user.data.application.physicaladdressesus_names[1].ssqstetogether_name)
            srt += `${user.data.application.physicaladdressesus_names[2]?.ssqstetogether_name}, `;

          if (
            user.data.application.physicaladdressesus_names[2]
              ?.physicalcity_name
          )
            // res.push(user.data.application.physicaladdressesus_names[1].physicalcity_name)
            srt += `${user.data.application.physicaladdressesus_names[2]?.physicalcity_name}, `;

          if (
            user.data.application.physicaladdressesus_names[2]
              ?.physicalprovincee_name
          )
            // res.push(user.data.application.physicaladdressesus_names[1].physicalprovincee_name)
            srt += `${user.data.application.physicaladdressesus_names[2]?.physicalprovincee_name}, `;

          if (
            user.data.application.physicaladdressesus_names[2]
              ?.physicalstate_name
          )
            // res.push(user.data.application.physicaladdressesus_names[1].physicalstate_name)
            srt += `${user.data.application.physicaladdressesus_names[2]?.physicalstate_name}, `;

          if (
            user.data.application.physicaladdressesus_names[2]?.zipphysical_name
          )
            // res.push(user.data.application.physicaladdressesus_names[1].zipphysical_name)
            srt += `${user.data.application.physicaladdressesus_names[2]?.zipphysical_name}, `;

          if (
            user.data.application.physicaladdressesus_names[2]?.physicalzip_name
          )
            // res.push(user.data.application.physicaladdressesus_names[1].physicalzip_name)
            srt += `${user.data.application.physicaladdressesus_names[2]?.physicalzip_name}, `;

          if (
            user.data.application.physicaladdressesus_names[2]
              ?.togetheraddressphysical_name === "USA"
          )
            // res.push(user.data.application.physicaladdressesus_names[1].togetheraddressphysical_name)
            srt += `${user.data.application.physicaladdressesus_names[2]?.togetheraddressphysical_name}, `;
          else if (
            user.data.application.physicaladdressesus_names[2]
              ?.togetheraddressphysical_name !== "USA" &&
            user.data.application.physicaladdressesus_names[1]
              ?.togetheraddressphysical_name.length
          )
            // res.push(user.data.application.physicaladdressesus_names[1]?.countphysical_name)
            srt += `${user.data.application.physicaladdressesus_names[2]?.countphysical_name}, `;

          if (
            user.data.application.physicaladdressesus_names[2]?.moveindate_name
          )
            // res.push(dateFormatter(user.data.application.physicaladdressesus_names[1].moveindate_name))
            srt += `${dateFormatter(
              user.data.application.physicaladdressesus_names[2]
                ?.moveindate_name
            )} TO `;

          if (
            user.data.application.physicaladdressesus_names[2]?.moveoutdate_name
          )
            // res.push(dateFormatter(user.data.application.physicaladdressesus_names[1].moveoutdate_name))
            srt += `${dateFormatter(
              user.data.application.physicaladdressesus_names[2]
                ?.moveoutdate_name
            )}`;

          form
            .getTextField("form1[0].#subform[11].Pt9Line3d_AdditionalInfo[0]")
            .setText(srt?.toUpperCase());
        }

        if (
          user.data.application?.physicaladdressesus_names[3]
            ?.streettogethersponsor_name
        ) {
          form
            .getTextField("form1[0].#subform[11].Pt9Line4a_PageNumber[0]")
            .setText("2");
        }

        if (
          user.data.application?.physicaladdressesus_names[3]
            ?.streettogethersponsor_name
        ) {
          form
            .getTextField("form1[0].#subform[11].Pt9Line4b_PartNumber[0]")
            .setText("2");
        }

        if (
          user.data.application?.physicaladdressesus_names[3]
            ?.streettogethersponsor_name
        ) {
          form
            .getTextField("form1[0].#subform[11].Pt9Line4c_ItemNumber[0]")
            .setText("12");
        }

        if (user.data.application.physicaladdressesus_names.length) {
          let srt = "";

          if (
            user.data.application.physicaladdressesus_names[3]
              ?.streettogethersponsor_name
          )
            // res.push(user.data.application.physicaladdressesus_names[3].streettogethersponsor_name)
            srt += `${user.data.application.physicaladdressesus_names[3]?.streettogethersponsor_name}, `;

          if (
            user.data.application.physicaladdressesus_names[3]
              ?.togethersponsorss_name
          )
            // res.push(user.data.application.physicaladdressesus_names[3].togethersponsorss_name)
            srt += `${user.data.application.physicaladdressesus_names[3]?.togethersponsorss_name} `;

          if (
            user.data.application.physicaladdressesus_names[3]
              ?.ssqstetogether_name
          )
            // res.push(user.data.application.physicaladdressesus_names[3].ssqstetogether_name)
            srt += `${user.data.application.physicaladdressesus_names[3]?.ssqstetogether_name}, `;

          if (
            user.data.application.physicaladdressesus_names[3]
              ?.physicalcity_name
          )
            // res.push(user.data.application.physicaladdressesus_names[3].physicalcity_name)
            srt += `${user.data.application.physicaladdressesus_names[3]?.physicalcity_name}, `;

          if (
            user.data.application.physicaladdressesus_names[3]
              ?.physicalprovincee_name
          )
            // res.push(user.data.application.physicaladdressesus_names[3].physicalprovincee_name)
            srt += `${user.data.application.physicaladdressesus_names[3]?.physicalprovincee_name}, `;

          if (
            user.data.application.physicaladdressesus_names[3]
              ?.physicalstate_name
          )
            // res.push(user.data.application.physicaladdressesus_names[3].physicalstate_name)
            srt += `${user.data.application.physicaladdressesus_names[3]?.physicalstate_name}, `;

          if (
            user.data.application.physicaladdressesus_names[3]?.zipphysical_name
          )
            // res.push(user.data.application.physicaladdressesus_names[3].zipphysical_name)
            srt += `${user.data.application.physicaladdressesus_names[3]?.zipphysical_name}, `;

          if (
            user.data.application.physicaladdressesus_names[3]?.physicalzip_name
          )
            // res.push(user.data.application.physicaladdressesus_names[3].physicalzip_name)
            srt += `${user.data.application.physicaladdressesus_names[3]?.physicalzip_name}, `;

          if (
            user.data.application.physicaladdressesus_names[3]
              ?.togetheraddressphysical_name === "USA"
          )
            // res.push(user.data.application.physicaladdressesus_names[3].togetheraddressphysical_name)
            srt += `${user.data.application.physicaladdressesus_names[3]?.togetheraddressphysical_name}, `;
          else if (
            user.data.application.physicaladdressesus_names[3]
              ?.togetheraddressphysical_name !== "USA" &&
            user.data.application.physicaladdressesus_names[3]
              ?.togetheraddressphysical_name.length
          )
            // res.push(user.data.application.physicaladdressesus_names[3]?.countphysical_name)
            srt += `${user.data.application.physicaladdressesus_names[3]?.countphysical_name}, `;

          if (
            user.data.application.physicaladdressesus_names[3]?.moveindate_name
          )
            // res.push(dateFormatter(user.data.application.physicaladdressesus_names[3].moveindate_name))
            srt += `${dateFormatter(
              user.data.application.physicaladdressesus_names[3]
                ?.moveindate_name
            )} TO `;

          if (
            user.data.application.physicaladdressesus_names[3]?.moveoutdate_name
          )
            // res.push(dateFormatter(user.data.application.physicaladdressesus_names[3].moveoutdate_name))
            srt += `${dateFormatter(
              user.data.application.physicaladdressesus_names[3]
                ?.moveoutdate_name
            )} \n `;

          if (
            user.data.application.physicaladdressesus_names[4]
              ?.streettogethersponsor_name
          )
            // res.push(user.data.application.physicaladdressesus_names[3].streettogethersponsor_name)
            srt += `${user.data.application.physicaladdressesus_names[4]?.streettogethersponsor_name}, `;

          if (
            user.data.application.physicaladdressesus_names[4]
              ?.togethersponsorss_name
          )
            // res.push(user.data.application.physicaladdressesus_names[1].togethersponsorss_name)
            srt += `${user.data.application.physicaladdressesus_names[4]?.togethersponsorss_name} `;

          if (
            user.data.application.physicaladdressesus_names[4]
              ?.ssqstetogether_name
          )
            // res.push(user.data.application.physicaladdressesus_names[1].ssqstetogether_name)
            srt += `${user.data.application.physicaladdressesus_names[4]?.ssqstetogether_name}, `;

          if (
            user.data.application.physicaladdressesus_names[4]
              ?.physicalcity_name
          )
            // res.push(user.data.application.physicaladdressesus_names[1].physicalcity_name)
            srt += `${user.data.application.physicaladdressesus_names[4]?.physicalcity_name}, `;

          if (
            user.data.application.physicaladdressesus_names[4]
              ?.physicalprovincee_name
          )
            // res.push(user.data.application.physicaladdressesus_names[1].physicalprovincee_name)
            srt += `${user.data.application.physicaladdressesus_names[4]?.physicalprovincee_name}, `;

          if (
            user.data.application.physicaladdressesus_names[4]
              ?.physicalstate_name
          )
            // res.push(user.data.application.physicaladdressesus_names[1].physicalstate_name)
            srt += `${user.data.application.physicaladdressesus_names[4]?.physicalstate_name}, `;

          if (
            user.data.application.physicaladdressesus_names[4]?.zipphysical_name
          )
            // res.push(user.data.application.physicaladdressesus_names[1].zipphysical_name)
            srt += `${user.data.application.physicaladdressesus_names[4]?.zipphysical_name}, `;

          if (
            user.data.application.physicaladdressesus_names[4]?.physicalzip_name
          )
            // res.push(user.data.application.physicaladdressesus_names[1].physicalzip_name)
            srt += `${user.data.application.physicaladdressesus_names[4]?.physicalzip_name}, `;

          if (
            user.data.application.physicaladdressesus_names[4]
              ?.togetheraddressphysical_name === "USA"
          )
            // res.push(user.data.application.physicaladdressesus_names[1].togetheraddressphysical_name)
            srt += `${user.data.application.physicaladdressesus_names[4]?.togetheraddressphysical_name}, `;
          else if (
            user.data.application.physicaladdressesus_names[4]
              ?.togetheraddressphysical_name !== "USA" &&
            user.data.application.physicaladdressesus_names[1]
              ?.togetheraddressphysical_name.length
          )
            // res.push(user.data.application.physicaladdressesus_names[1]?.countphysical_name)
            srt += `${user.data.application.physicaladdressesus_names[4]?.countphysical_name}, `;

          if (
            user.data.application.physicaladdressesus_names[4]?.moveindate_name
          )
            // res.push(dateFormatter(user.data.application.physicaladdressesus_names[1].moveindate_name))
            srt += `${dateFormatter(
              user.data.application.physicaladdressesus_names[4]
                ?.moveindate_name
            )} TO `;

          if (
            user.data.application.physicaladdressesus_names[4]?.moveoutdate_name
          )
            // res.push(dateFormatter(user.data.application.physicaladdressesus_names[1].moveoutdate_name))
            srt += `${dateFormatter(
              user.data.application.physicaladdressesus_names[4]
                ?.moveoutdate_name
            )} `;

          form
            .getTextField("form1[0].#subform[11].Pt9Line4d_AdditionalInfo[0]")
            .setText(srt?.toUpperCase());
        }

        if(user.data.application.sponsoremploymentfiveyears_names && user.data.application.sponsoremploymentfiveyears_names.length) {

          if (
            user.data.application?.sponsoremploymentfiveyears_names[2]
              ?.admissiontown_name
          ) {
            form
              .getTextField("form1[0].#subform[11].Pt9Line5a_PageNumber[0]")
              .setText("4");
          }

          if (
            user.data.application?.sponsoremploymentfiveyears_names[2]
              ?.admissiontown_name
          ) {
            form
              .getTextField("form1[0].#subform[11].Pt9Line5b_PartNumber[0]")
              .setText("2");
          }

          if (
            user.data.application?.sponsoremploymentfiveyears_names[2]
              ?.admissiontown_name
          ) {
            form
              .getTextField("form1[0].#subform[11].Pt9Line5c_ItemNumber[0]")
              .setText("42");
          }

          if (user.data.application.sponsoremploymentfiveyears_names.length) {
            let srt = "";

            if (
              user.data.application.sponsoremploymentfiveyears_names[2]
                ?.admissiontown_name
            )
              // res.push(user.data.application.sponsoremploymentfiveyears_names[2].admissiontown_name)
              srt += `${user.data.application.sponsoremploymentfiveyears_names[2]?.admissiontown_name}, `;

            if (
              user.data.application.sponsoremploymentfiveyears_names[2]
                ?.togetheremployer_name
            )
              // res.push(user.data.application.sponsoremploymentfiveyears_names[2].togetheremployer_name)
              srt += `${user.data.application.sponsoremploymentfiveyears_names[2]?.togetheremployer_name}, `;

            if (
              user.data.application.sponsoremploymentfiveyears_names[2]
                ?.employersponsor_name
            )
              // res.push(user.data.application.sponsoremploymentfiveyears_names[2].employersponsor_name)
              srt += `${user.data.application.sponsoremploymentfiveyears_names[2]?.employersponsor_name} `;

            if (
              user.data.application.sponsoremploymentfiveyears_names[2]
                ?.sponsorphysicalusstetogether_name
            )
              // res.push(user.data.application.sponsoremploymentfiveyears_names[2].sponsorphysicalusstetogether_name)
              srt += `${user.data.application.sponsoremploymentfiveyears_names[2]?.sponsorphysicalusstetogether_name}, `;

            if (
              user.data.application.sponsoremploymentfiveyears_names[2]
                ?.employertogether_name
            )
              // res.push(user.data.application.sponsoremploymentfiveyears_names[2].employertogether_name)
              srt += `${user.data.application.sponsoremploymentfiveyears_names[2]?.employertogether_name}, `;

            if (
              user.data.application.sponsoremploymentfiveyears_names[2]
                ?.togetherinceemployer_name
            )
              // res.push(user.data.application.sponsoremploymentfiveyears_names[2].togetherinceemployer_name)
              srt += `${user.data.application.sponsoremploymentfiveyears_names[2]?.togetherinceemployer_name}, `;

            if (
              user.data.application.sponsoremploymentfiveyears_names[2]
                ?.togetherlcodeemployer_name
            )
              // res.push(user.data.application.sponsoremploymentfiveyears_names[2].togetherlcodeemployer_name)
              srt += `${user.data.application.sponsoremploymentfiveyears_names[2]?.togetherlcodeemployer_name}, `;

            if (
              user.data.application.sponsoremploymentfiveyears_names[2]
                ?.employerprovinceplace_name
            )
              // res.push(user.data.application.sponsoremploymentfiveyears_names[2].employerprovinceplace_name)
              srt += `${user.data.application.sponsoremploymentfiveyears_names[2]?.employerprovinceplace_name}, `;

            if (
              user.data.application.sponsoremploymentfiveyears_names[2]
                ?.employerpostalcodeplace_name
            )
              // res.push(user.data.application.sponsoremploymentfiveyears_names[2].employerpostalcodeplace_name)
              srt += `${user.data.application.sponsoremploymentfiveyears_names[2]?.employerpostalcodeplace_name}, `;

            if (
              user.data.application.sponsoremploymentfiveyears_names[2]
                ?.admissionoccupationus_name
            )
              // res.push(user.data.application.sponsoremploymentfiveyears_names[5].admissionoccupationus_name)
              srt += `${user.data.application.sponsoremploymentfiveyears_names[2]?.admissionoccupationus_name}, `;

            if (
              user.data.application.sponsoremploymentfiveyears_names[2]
                ?.employercountry_name
            )
              // res.push(user.data.application.sponsoremploymentfiveyears_names[2].employercountry_name)
              srt += `${user.data.application.sponsoremploymentfiveyears_names[2]?.employercountry_name}, `;

            if (
              user.data.application.sponsoremploymentfiveyears_names[2]
                ?.togetheraddressphysical_name === "USA"
            )
              // res.push(user.data.application.sponsoremploymentfiveyears_names[2].togetheraddressphysical_name)
              srt += `${user.data.application.sponsoremploymentfiveyears_names[2]?.togetheraddressphysical_name}, `;
            else if (
              user.data.application.sponsoremploymentfiveyears_names[2]
                ?.togetheraddressphysical_name !== "USA" &&
              user.data.application.sponsoremploymentfiveyears_names[2]
                ?.togetheraddressphysical_name
            )
              // res.push(user.data.application.sponsoremploymentfiveyears_names[2]?.countphysical_name)
              srt += `${user.data.application.sponsoremploymentfiveyears_names[2]?.countphysical_name}, `;

            if (
              user.data.application.sponsoremploymentfiveyears_names[2]
                ?.employmentstart_name
            )
              // res.push(dateFormatter(user.data.application.sponsoremploymentfiveyears_names[2].employmentstart_name))
              srt += `${dateFormatter(
                user.data.application.sponsoremploymentfiveyears_names[2]
                  ?.employmentstart_name
              )} TO `;

            if (
              user.data.application.sponsoremploymentfiveyears_names[2]
                ?.admissiontownnn_name
            )
              // res.push(dateFormatter(user.data.application.sponsoremploymentfiveyears_names[2].admissiontownnn_name))
              srt += `${dateFormatter(
                user.data.application.sponsoremploymentfiveyears_names[2]
                  ?.admissiontownnn_name
              )} \n `;

            if (
              user.data.application.sponsoremploymentfiveyears_names[3]
                ?.admissiontown_name
            )
              // res.push(user.data.application.sponsoremploymentfiveyears_names[3].admissiontown_name)
              srt += `${user.data.application.sponsoremploymentfiveyears_names[3]?.admissiontown_name}, `;

            if (
              user.data.application.sponsoremploymentfiveyears_names[3]
                ?.togetheremployer_name
            )
              // res.push(user.data.application.sponsoremploymentfiveyears_names[3].togetheremployer_name)
              srt += `${user.data.application.sponsoremploymentfiveyears_names[3]?.togetheremployer_name}, `;

            if (
              user.data.application.sponsoremploymentfiveyears_names[3]
                ?.employersponsor_name
            )
              // res.push(user.data.application.sponsoremploymentfiveyears_names[3].employersponsor_name)
              srt += `${user.data.application.sponsoremploymentfiveyears_names[3]?.employersponsor_name} `;

            if (
              user.data.application.sponsoremploymentfiveyears_names[3]
                ?.sponsorphysicalusstetogether_name
            )
              // res.push(user.data.application.sponsoremploymentfiveyears_names[3].sponsorphysicalusstetogether_name)
              srt += `${user.data.application.sponsoremploymentfiveyears_names[3]?.sponsorphysicalusstetogether_name}, `;

            if (
              user.data.application.sponsoremploymentfiveyears_names[3]
                ?.employertogether_name
            )
              // res.push(user.data.application.sponsoremploymentfiveyears_names[3].employertogether_name)
              srt += `${user.data.application.sponsoremploymentfiveyears_names[3]?.employertogether_name}, `;

            if (
              user.data.application.sponsoremploymentfiveyears_names[3]
                ?.togetherinceemployer_name
            )
              // res.push(user.data.application.sponsoremploymentfiveyears_names[3].togetherinceemployer_name)
              srt += `${user.data.application.sponsoremploymentfiveyears_names[3]?.togetherinceemployer_name}, `;

            if (
              user.data.application.sponsoremploymentfiveyears_names[3]
                ?.togetherlcodeemployer_name
            )
              // res.push(user.data.application.sponsoremploymentfiveyears_names[3].togetherlcodeemployer_name)
              srt += `${user.data.application.sponsoremploymentfiveyears_names[3]?.togetherlcodeemployer_name}, `;

            if (
              user.data.application.sponsoremploymentfiveyears_names[3]
                ?.employerprovinceplace_name
            )
              // res.push(user.data.application.sponsoremploymentfiveyears_names[3].employerprovinceplace_name)
              srt += `${user.data.application.sponsoremploymentfiveyears_names[3]?.employerprovinceplace_name}, `;

            if (
              user.data.application.sponsoremploymentfiveyears_names[3]
                ?.employerpostalcodeplace_name
            )
              // res.push(user.data.application.sponsoremploymentfiveyears_names[3].employerpostalcodeplace_name)
              srt += `${user.data.application.sponsoremploymentfiveyears_names[3]?.employerpostalcodeplace_name}, `;

            if (
              user.data.application.sponsoremploymentfiveyears_names[3]
                ?.admissionoccupationus_name
            )
              // res.push(user.data.application.sponsoremploymentfiveyears_names[5].admissionoccupationus_name)
              srt += `${user.data.application.sponsoremploymentfiveyears_names[3]?.admissionoccupationus_name}, `;

            if (
              user.data.application.sponsoremploymentfiveyears_names[3]
                ?.employercountry_name
            )
              // res.push(user.data.application.sponsoremploymentfiveyears_names[3].employercountry_name)
              srt += `${user.data.application.sponsoremploymentfiveyears_names[3]?.employercountry_name}, `;

            if (
              user.data.application.sponsoremploymentfiveyears_names[3]
                ?.togetheraddressphysical_name === "USA"
            )
              // res.push(user.data.application.sponsoremploymentfiveyears_names[3].togetheraddressphysical_name)
              srt += `${user.data.application.sponsoremploymentfiveyears_names[3]?.togetheraddressphysical_name}, `;
            else if (
              user.data.application.sponsoremploymentfiveyears_names[3]
                ?.togetheraddressphysical_name !== "USA" &&
              user.data.application.sponsoremploymentfiveyears_names[3]
                ?.togetheraddressphysical_name
            )
              // res.push(user.data.application.sponsoremploymentfiveyears_names[3]?.countphysical_name)
              srt += `${user.data.application.sponsoremploymentfiveyears_names[3]?.countphysical_name}, `;

            if (
              user.data.application.sponsoremploymentfiveyears_names[3]
                ?.employmentstart_name
            )
              // res.push(dateFormatter(user.data.application.sponsoremploymentfiveyears_names[3].employmentstart_name))
              srt += `${dateFormatter(
                user.data.application.sponsoremploymentfiveyears_names[3]
                  ?.employmentstart_name
              )} TO `;

            if (
              user.data.application.sponsoremploymentfiveyears_names[3]
                ?.admissiontownnn_name
            )
              // res.push(dateFormatter(user.data.application.sponsoremploymentfiveyears_names[3].admissiontownnn_name))
              srt += `${dateFormatter(
                user.data.application.sponsoremploymentfiveyears_names[3]
                  ?.admissiontownnn_name
              )} `;

            form
              .getTextField("form1[0].#subform[11].Pt9Line5d_AdditionalInfo[0]")
              .setText(srt?.toUpperCase());
          }

          if (
            user.data.application.sponsoremploymentfiveyears_names[4]
              ?.admissiontown_name
          ) {
            form
              .getTextField("form1[0].#subform[11].Pt9Line6a_PageNumber[0]")
              .setText("4");
          }

          if (
            user.data.application.sponsoremploymentfiveyears_names[4]
              ?.admissiontown_name
          ) {
            form
              .getTextField("form1[0].#subform[11].Pt9Line6b_PartNumber[0]")
              .setText("2");
          }

          if (
            user.data.application.sponsoremploymentfiveyears_names[4]
              ?.admissiontown_name
          ) {
            form
              .getTextField("form1[0].#subform[11].Pt9Line6c_ItemNumber[0]")
              .setText("42");
          }

          if (user.data.application.sponsoremploymentfiveyears_names.length) {
            let srt = "";

            if (
              user.data.application.sponsoremploymentfiveyears_names[4]
                ?.admissiontown_name
            )
              // res.push(user.data.application.sponsoremploymentfiveyears_names[4].admissiontown_name)
              srt += `${user.data.application.sponsoremploymentfiveyears_names[4]?.admissiontown_name}, `;

            if (
              user.data.application.sponsoremploymentfiveyears_names[4]
                ?.togetheremployer_name
            )
              // res.push(user.data.application.sponsoremploymentfiveyears_names[4].togetheremployer_name)
              srt += `${user.data.application.sponsoremploymentfiveyears_names[4]?.togetheremployer_name}, `;

            if (
              user.data.application.sponsoremploymentfiveyears_names[4]
                ?.employersponsor_name
            )
              // res.push(user.data.application.sponsoremploymentfiveyears_names[4].employersponsor_name)
              srt += `${user.data.application.sponsoremploymentfiveyears_names[4]?.employersponsor_name} `;

            if (
              user.data.application.sponsoremploymentfiveyears_names[4]
                ?.sponsorphysicalusstetogether_name
            )
              // res.push(user.data.application.sponsoremploymentfiveyears_names[4].sponsorphysicalusstetogether_name)
              srt += `${user.data.application.sponsoremploymentfiveyears_names[4]?.sponsorphysicalusstetogether_name}, `;

            if (
              user.data.application.sponsoremploymentfiveyears_names[4]
                ?.employertogether_name
            )
              // res.push(user.data.application.sponsoremploymentfiveyears_names[4].employertogether_name)
              srt += `${user.data.application.sponsoremploymentfiveyears_names[4]?.employertogether_name}, `;

            if (
              user.data.application.sponsoremploymentfiveyears_names[4]
                ?.togetherinceemployer_name
            )
              // res.push(user.data.application.sponsoremploymentfiveyears_names[4].togetherinceemployer_name)
              srt += `${user.data.application.sponsoremploymentfiveyears_names[4]?.togetherinceemployer_name}, `;

            if (
              user.data.application.sponsoremploymentfiveyears_names[4]
                ?.togetherlcodeemployer_name
            )
              // res.push(user.data.application.sponsoremploymentfiveyears_names[4].togetherlcodeemployer_name)
              srt += `${user.data.application.sponsoremploymentfiveyears_names[4]?.togetherlcodeemployer_name}, `;

            if (
              user.data.application.sponsoremploymentfiveyears_names[4]
                ?.employerprovinceplace_name
            )
              // res.push(user.data.application.sponsoremploymentfiveyears_names[4].employerprovinceplace_name)
              srt += `${user.data.application.sponsoremploymentfiveyears_names[4]?.employerprovinceplace_name}, `;

            if (
              user.data.application.sponsoremploymentfiveyears_names[4]
                ?.employerpostalcodeplace_name
            )
              // res.push(user.data.application.sponsoremploymentfiveyears_names[4].employerpostalcodeplace_name)
              srt += `${user.data.application.sponsoremploymentfiveyears_names[4]?.employerpostalcodeplace_name}, `;

            if (
              user.data.application.sponsoremploymentfiveyears_names[4]
                ?.admissionoccupationus_name
            )
              // res.push(user.data.application.sponsoremploymentfiveyears_names[5].admissionoccupationus_name)
              srt += `${user.data.application.sponsoremploymentfiveyears_names[4]?.admissionoccupationus_name}, `;

            if (
              user.data.application.sponsoremploymentfiveyears_names[4]
                ?.employercountry_name
            )
              // res.push(user.data.application.sponsoremploymentfiveyears_names[4].employercountry_name)
              srt += `${user.data.application.sponsoremploymentfiveyears_names[4]?.employercountry_name}, `;

            if (
              user.data.application.sponsoremploymentfiveyears_names[4]
                ?.adaddressemployer_name === "USA"
            )
              // res.push(user.data.application.sponsoremploymentfiveyears_names[4].adaddressemployer_name)
              srt += `${user.data.application.sponsoremploymentfiveyears_names[4]?.adaddressemployer_name}, `;
            else if (
              user.data.application.sponsoremploymentfiveyears_names[4]
                ?.adaddressemployer_name !== "USA" &&
              user.data.application.sponsoremploymentfiveyears_names[4]
                ?.togetheraddressphysical_name
            )
              // res.push(user.data.application.sponsoremploymentfiveyears_names[4]?.countphysical_name)
              srt += `${user.data.application.sponsoremploymentfiveyears_names[4]?.countphysical_name}, `;

            if (
              user.data.application.sponsoremploymentfiveyears_names[4]
                ?.employmentstart_name
            )
              // res.push(dateFormatter(user.data.application.sponsoremploymentfiveyears_names[4].employmentstart_name))
              srt += `${dateFormatter(
                user.data.application.sponsoremploymentfiveyears_names[4]
                  ?.employmentstart_name
              )} TO `;

            if (
              user.data.application.sponsoremploymentfiveyears_names[4]
                ?.admissiontownnn_name
            )
              // res.push(dateFormatter(user.data.application.sponsoremploymentfiveyears_names[4].admissiontownnn_name))
              srt += `${dateFormatter(
                user.data.application.sponsoremploymentfiveyears_names[4]
                  ?.admissiontownnn_name
              )} \n`;

            if (
              user.data.application.sponsoremploymentfiveyears_names[5]
                ?.admissiontown_name
            )
              // res.push(user.data.application.sponsoremploymentfiveyears_names[5].admissiontown_name)
              srt += `${user.data.application.sponsoremploymentfiveyears_names[5]?.admissiontown_name}, `;

            if (
              user.data.application.sponsoremploymentfiveyears_names[5]
                ?.togetheremployer_name
            )
              // res.push(user.data.application.sponsoremploymentfiveyears_names[5].togetheremployer_name)
              srt += `${user.data.application.sponsoremploymentfiveyears_names[5]?.togetheremployer_name}, `;

            if (
              user.data.application.sponsoremploymentfiveyears_names[5]
                ?.employersponsor_name
            )
              // res.push(user.data.application.sponsoremploymentfiveyears_names[5].employersponsor_name)
              srt += `${user.data.application.sponsoremploymentfiveyears_names[5]?.employersponsor_name} `;

            if (
              user.data.application.sponsoremploymentfiveyears_names[5]
                ?.sponsorphysicalusstetogether_name
            )
              // res.push(user.data.application.sponsoremploymentfiveyears_names[5].sponsorphysicalusstetogether_name)
              srt += `${user.data.application.sponsoremploymentfiveyears_names[5]?.sponsorphysicalusstetogether_name}, `;

            if (
              user.data.application.sponsoremploymentfiveyears_names[5]
                ?.employertogether_name
            )
              // res.push(user.data.application.sponsoremploymentfiveyears_names[5].employertogether_name)
              srt += `${user.data.application.sponsoremploymentfiveyears_names[5]?.employertogether_name}, `;

            if (
              user.data.application.sponsoremploymentfiveyears_names[5]
                ?.togetherinceemployer_name
            )
              // res.push(user.data.application.sponsoremploymentfiveyears_names[5].togetherinceemployer_name)
              srt += `${user.data.application.sponsoremploymentfiveyears_names[5]?.togetherinceemployer_name}, `;

            if (
              user.data.application.sponsoremploymentfiveyears_names[5]
                ?.togetherlcodeemployer_name
            )
              // res.push(user.data.application.sponsoremploymentfiveyears_names[5].togetherlcodeemployer_name)
              srt += `${user.data.application.sponsoremploymentfiveyears_names[5]?.togetherlcodeemployer_name}, `;

            if (
              user.data.application.sponsoremploymentfiveyears_names[5]
                ?.employerprovinceplace_name
            )
              // res.push(user.data.application.sponsoremploymentfiveyears_names[5].employerprovinceplace_name)
              srt += `${user.data.application.sponsoremploymentfiveyears_names[5]?.employerprovinceplace_name}, `;

            if (
              user.data.application.sponsoremploymentfiveyears_names[5]
                ?.admissionoccupationus_name
            )
              // res.push(user.data.application.sponsoremploymentfiveyears_names[5].admissionoccupationus_name)
              srt += `${user.data.application.sponsoremploymentfiveyears_names[5]?.admissionoccupationus_name}, `;

            if (
              user.data.application.sponsoremploymentfiveyears_names[5]
                ?.employerpostalcodeplace_name
            )
              // res.push(user.data.application.sponsoremploymentfiveyears_names[5].employerpostalcodeplace_name)
              srt += `${user.data.application.sponsoremploymentfiveyears_names[5]?.employerpostalcodeplace_name}, `;

            if (
              user.data.application.sponsoremploymentfiveyears_names[5]
                ?.employercountry_name
            )
              // res.push(user.data.application.sponsoremploymentfiveyears_names[5].employercountry_name)
              srt += `${user.data.application.sponsoremploymentfiveyears_names[5]?.employercountry_name}, `;

            if (
              user.data.application.sponsoremploymentfiveyears_names[5]
                ?.adaddressemployer_name === "USA"
            )
              // res.push(user.data.application.sponsoremploymentfiveyears_names[5].adaddressemployer_name)
              srt += `${user.data.application.sponsoremploymentfiveyears_names[5]?.adaddressemployer_name}, `;
            else if (
              user.data.application.sponsoremploymentfiveyears_names[5]
                ?.adaddressemployer_name !== "USA" &&
              user.data.application.sponsoremploymentfiveyears_names[5]
                ?.togetheraddressphysical_name
            )
              // res.push(user.data.application.sponsoremploymentfiveyears_names[5]?.countphysical_name)
              srt += `${user.data.application.sponsoremploymentfiveyears_names[5]?.countphysical_name}, `;

            if (
              user.data.application.sponsoremploymentfiveyears_names[5]
                ?.employmentstart_name
            )
              // res.push(dateFormatter(user.data.application.sponsoremploymentfiveyears_names[5].employmentstart_name))
              srt += `${dateFormatter(
                user.data.application.sponsoremploymentfiveyears_names[5]
                  ?.employmentstart_name
              )} TO `;

            if (
              user.data.application.sponsoremploymentfiveyears_names[5]
                ?.admissiontownnn_name
            )
              // res.push(dateFormatter(user.data.application.sponsoremploymentfiveyears_names[5].admissiontownnn_name))
              srt += `${dateFormatter(
                user.data.application.sponsoremploymentfiveyears_names[5]
                  ?.admissiontownnn_name
              )} `;

            form
              .getTextField("form1[0].#subform[11].Pt9Line6d_AdditionalInfo[0]")
              .setText(srt?.toUpperCase());
          }
        }

        if (user.data.application.insaidedateofbirrth_name) {
          form
            .getTextField("form1[0].#subform[1].Pt2Line8_DateofBirth[0]")
            .setText(
              dateFormatter(user.data.application.insaidedateofbirrth_name)
            );
        }

        if (user.data.application.sponsorphysicaladdress_name == "yes") {
          form.getCheckBox("form1[0].#subform[1].Pt2Line11_Yes[0]").check();
        } else {
          form.getCheckBox("form1[0].#subform[1].Pt2Line11_Yes[0]").uncheck();
        }

        if (user.data.application.sponsorphysicaladdress_name == "no") {
          form.getCheckBox("form1[0].#subform[1].Pt2Line11_No[0]").check();
        } else {
          form.getCheckBox("form1[0].#subform[1].Pt2Line11_No[0]").uncheck();
        }

        // Country of birth

        if (user.data.application.ofinsidesponsorbirth_name) {
          form
            .getTextField("form1[0].#subform[1].Pt2Line7_CountryofBirth[0]")
            .setText(
              user.data.application.ofinsidesponsorbirth_name?.toUpperCase()
            );
        }

        // City or town of birth

        if (user.data.application.cityinside_name) {
          form
            .getTextField("form1[0].#subform[1].Pt2Line6_CityTownOfBirth[0]")
            .setText(user.data.application.cityinside_name?.toUpperCase());
        }

        // JERRY's U.S. social security number

        if (
          user.data.application.securitynumberone_name +
          user.data.application.securitynumbertwo_name +
          user.data.application.securitynumberthree_name
        ) {
          form
            .getTextField("form1[0].#subform[0].Pt2Line11_SSN[0]")
            .setText(
              user.data.application.securitynumberone_name +
                user.data.application.securitynumbertwo_name +
                user.data.application.securitynumberthree_name
            );
        }

        //City town

        if (user.data.application.admissiontown_name) {
          form
            .getTextField("form1[0].#subform[7].Pt4Line60a_CityOrTown[0]")
            .setText(user.data.application.admissiontown_name?.toUpperCase());
        }

        // State

        if (user.data.application.applicationstate_name) {
          form
            .getDropdown("form1[0].#subform[7].Pt4Line60b_State[0]")
            .select(user.data.application.applicationstate_name);
        }

        if (user.data.application.sponsorname) {
          form
            .getTextField("form1[0].#subform[11].Pt2Line4b_GivenName[1]")
            .setText(user.data.application.sponsorname?.toUpperCase());
        }

        if (user.data.application.sponsormiddle_name) {
          form
            .getTextField("form1[0].#subform[11].Pt2Line4c_MiddleName[1]")
            .setText(user.data.application.sponsormiddle_name?.toUpperCase());
        }

        if (user.data.application.sponsorfamily_name) {
          form
            .getTextField("form1[0].#subform[11].Pt2Line4a_FamilyName[1]")
            .setText(user.data.application.sponsorfamily_name?.toUpperCase());
        }

        // The applicant is not the petitioner

        if (user.data.application.sponsorfamily_name) {
          form
            .getTextField("form1[0].#subform[0].Pt2Line4a_FamilyName[0]")
            .setText(user.data.application.sponsorfamily_name?.toUpperCase());
        }

        if (user.data.application.sponsorname) {
          form
            .getTextField("form1[0].#subform[0].Pt2Line4b_GivenName[0]")
            .setText(user.data.application.sponsorname?.toUpperCase());
        }

        if (user.data.application.sponsormiddle_name) {
          form
            .getTextField("form1[0].#subform[0].Pt2Line4c_MiddleName[0]")
            .setText(user.data.application.sponsormiddle_name?.toUpperCase());
        }

        if (user.data.application.mailingaddressus_name !== "no") {
          // Street number and name

          if (user.data.application.mailingnumber_name) {
            form
              .getTextField(
                "form1[0].#subform[4].Pt4Line11_StreetNumberName[0]"
              )
              .setText(user.data.application.mailingnumber_name?.toUpperCase());
          }

          // Apt./Ste./Flr. Number (if any)

          if (user.data.application.apt_name == "steaplase") {
            form.getCheckBox("form1[0].#subform[4].Pt4Line11_Unit[0]").check();
          } else {
            form
              .getCheckBox("form1[0].#subform[4].Pt4Line11_Unit[0]")
              .uncheck();
          }

          if (user.data.application.apt_name == "flrpalase") {
            form.getCheckBox("form1[0].#subform[4].Pt4Line11_Unit[1]").check();
          } else {
            form
              .getCheckBox("form1[0].#subform[4].Pt4Line11_Unit[1]")
              .uncheck();
          }

          if (user.data.application.apt_name == "aptplase") {
            form.getCheckBox("form1[0].#subform[4].Pt4Line11_Unit[2]").check();
          } else {
            form
              .getCheckBox("form1[0].#subform[4].Pt4Line11_Unit[2]")
              .uncheck();
          }

          // Number (if any)

          if (user.data.application.selectste_name) {
            form
              .getTextField("form1[0].#subform[4].Pt4Line11_AptSteFlrNumber[0]")
              .setText(user.data.application.typeofaddress_names[0].stedf_name);
          }

          // City or town

          if (user.data.application.mailingcity_name) {
            form
              .getTextField("form1[0].#subform[4].Pt4Line11_CityOrTown[0]")
              .setText(user.data.application.mailingcity_name?.toUpperCase());
          }

          // State

          if (user.data.application.insidemailingprovince_name) {
            form
              .getDropdown("form1[0].#subform[4].Pt4Line11_State[0]")
              .select(
                user.data.application.insidemailingprovince_name?.toUpperCase()
              );
          }

          // Province

          if (user.data.application.mailingprovince_name) {
            form
              .getTextField("form1[0].#subform[4].Pt4Line11_Province[0]")
              .setText(
                user.data.application.mailingprovince_name?.toUpperCase()
              );
          }
          // ZIP Code

          if (user.data.application.mailingpostalcode_name) {
            form
              .getTextField("form1[0].#subform[4].Pt4Line11_ZipCode[0]")
              .setText(
                user.data.application.mailingpostalcode_name?.toUpperCase()
              );
          }
          // Postal code

          if (user.data.application.mailingpostalcodedsa_name) {
            form
              .getTextField("form1[0].#subform[4].Pt4Line11_PostalCode[0]")
              .setText(
                user.data.application.mailingpostalcodedsa_name?.toUpperCase()
              );
          }

          // Country

          if (user.data.application.mailing_name === "USA") {
            form
              .getTextField("form1[0].#subform[4].Pt4Line11_Country[0]")
              .setText("USA"?.toUpperCase());
          } else if (user.data.application.mailingcountry_name) {
            form
              .getTextField("form1[0].#subform[4].Pt4Line11_Country[0]")
              .setText(
                user.data.application.mailingcountry_name?.toUpperCase()
              );
          }
        }

        if (user.data.application.mailingaddressus_name === "no") {
          // Street number and name

          if (user.data.application.insideusnumber_name) {
            form
              .getTextField(
                "form1[0].#subform[4].Pt4Line11_StreetNumberName[0]"
              )
              .setText(
                user.data.application.insideusnumber_name?.toUpperCase()
              );
          }

          // Apt./Ste./Flr. Number (if any)

          if (user.data.application.insideusifany_name == "Ste") {
            form.getCheckBox("form1[0].#subform[4].Pt4Line11_Unit[0]").check();
          } else {
            form
              .getCheckBox("form1[0].#subform[4].Pt4Line11_Unit[0]")
              .uncheck();
          }

          if (user.data.application.insideusifany_name == "Flr") {
            form.getCheckBox("form1[0].#subform[4].Pt4Line11_Unit[1]").check();
          } else {
            form
              .getCheckBox("form1[0].#subform[4].Pt4Line11_Unit[1]")
              .uncheck();
          }

          if (user.data.application.insideusifany_name == "Apt") {
            form.getCheckBox("form1[0].#subform[4].Pt4Line11_Unit[2]").check();
          } else {
            form
              .getCheckBox("form1[0].#subform[4].Pt4Line11_Unit[2]")
              .uncheck();
          }

          // Number (if any)

          if (user.data.application.usifanyselest_name) {
            form
              .getTextField("form1[0].#subform[4].Pt4Line11_AptSteFlrNumber[0]")
              .setText(user.data.application.usifanyselest_name);
          }

          // City or town

          if (user.data.application.insideusgcity_name) {
            form
              .getTextField("form1[0].#subform[4].Pt4Line11_CityOrTown[0]")
              .setText(user.data.application.insideusgcity_name?.toUpperCase());
          }

          // State

          if (user.data.application.insideusstate_name) {
            form
              .getDropdown("form1[0].#subform[4].Pt4Line11_State[0]")
              .select(user.data.application.insideusstate_name?.toUpperCase());
          }

          // ZIP Code

          if (user.data.application.insideuscode_name) {
            form
              .getTextField("form1[0].#subform[4].Pt4Line11_ZipCode[0]")
              .setText(user.data.application.insideuscode_name?.toUpperCase());
          }

          // }

          // Country

          if (user.data.application.insideusaddress_name === "USA") {
            form
              .getTextField("form1[0].#subform[4].Pt4Line11_Country[0]")
              .setText("USA"?.toUpperCase());
          } else if (user.data.application.insideusaddress_name !== "USA") {
            form
              .getTextField("form1[0].#subform[4].Pt4Line11_Country[0]")
              .setText(
                user.data.application.placemailingcountry_name?.toUpperCase()
              );
          }
        }

        // Street number and name

        if (user.data.application.insideusnumber_name) {
          form
            .getTextField("form1[0].#subform[4].Pt4Line12a_StreetNumberName[0]")
            .setText(user.data.application.insideusnumber_name?.toUpperCase());
        }

        // Apt./Ste./Flr. Number (if any)

        if (user.data.application.insideusifany_name == "Apt") {
          form.getCheckBox("form1[0].#subform[4].Pt4Line12b_Unit[0]").check();
        } else {
          form.getCheckBox("form1[0].#subform[4].Pt4Line12b_Unit[0]").uncheck();
        }

        if (user.data.application.insideusifany_name == "Ste") {
          form.getCheckBox("form1[0].#subform[4].Pt4Line12b_Unit[1]").check();
        } else {
          form.getCheckBox("form1[0].#subform[4].Pt4Line12b_Unit[1]").uncheck();
        }

        if (user.data.application.insideusifany_name == "Flr") {
          form.getCheckBox("form1[0].#subform[4].Pt4Line12b_Unit[2]").check();
        } else {
          form.getCheckBox("form1[0].#subform[4].Pt4Line12b_Unit[2]").uncheck();
        }

        // Number (if any)

        if (user.data.application.usifanyselest_name) {
          form
            .getTextField("form1[0].#subform[4].Pt4Line12b_AptSteFlrNumber[0]")
            .setText(user.data.application.usifanyselest_name?.toUpperCase());
        }

        // City or town

        if (user.data.application.insideusgcity_name) {
          form
            .getTextField("form1[0].#subform[4].Pt4Line12c_CityOrTown[0]")
            .setText(user.data.application.insideusgcity_name?.toUpperCase());
        }

        // State

        if (user.data.application.insideusstate_name) {
          form
            .getDropdown("form1[0].#subform[4].Pt4Line12d_State[0]")
            .select(user.data.application.insideusstate_name?.toUpperCase());
        }

        // // Province

        // if (user.data.application.typeofaddress_names[0].futurfuturestate_name) {
        // 	form.getTextField('form1[0].#subform[4].Pt4Line11_Province[0]').setText(user.data.application.typeofaddress_names[0].futurfuturestate_name);
        // }

        // ZIP Code

        if (user.data.application.insideuscode_name) {
          form
            .getTextField("form1[0].#subform[4].Pt4Line12e_ZipCode[0]")
            .setText(user.data.application.insideuscode_name?.toUpperCase());
        }
        // // Postal code

        // if (user.data.application.typeofaddress_names[0].futurepreviousfutu_name) {
        // 	form.getTextField('form1[0].#subform[4].Pt4Line11_PostalCode[0]').setText(user.data.application.typeofaddress_names[0].futurepreviousfutu_name);
        // }

        // // Country

        // if (user.data.application.typeofaddress_names[0].recenstcountryfuture_name) {
        // 	form.getTextField('form1[0].#subform[4].Pt4Line11_Country[0]').setText(user.data.application.typeofaddress_names[0].recenstcountryfuture_name);
        // }

        if (Array.isArray(user.data.application.other_names)) {
          if (user.data.application.other_names.length > 0) {
            if (user.data.application.other_names[0].sublastname_name) {
              form
                .getTextField("form1[0].#subform[4].P4Line5a_FamilyName[0]")
                .setText(
                  user.data.application.other_names[0].sublastname_name?.toUpperCase()
                );
            }
            if (user.data.application.other_names[0].subfirstname_name) {
              form
                .getTextField("form1[0].#subform[4].Pt4Line5b_GivenName[0]")
                .setText(
                  user.data.application.other_names[0].subfirstname_name?.toUpperCase()
                );
            }
            if (user.data.application.other_names[0].submiddlename_name) {
              form
                .getTextField("form1[0].#subform[4].Pt4Line5c_MiddleName[0]")
                .setText(
                  user.data.application.other_names[0].submiddlename_name?.toUpperCase()
                );
            }
          }
        }

        // NAME

        if (user.data.application.family_name) {
          form
            .getTextField("form1[0].#subform[4].Pt4Line4a_FamilyName[0]")
            .setText(user.data.application.family_name?.toUpperCase());
        }
        if (user.data.application.name) {
          form
            .getTextField("form1[0].#subform[4].Pt4Line4b_GivenName[0]")
            .setText(user.data.application.name?.toUpperCase());
        }
        if (user.data.application.middle_name) {
          form
            .getTextField("form1[0].#subform[4].Pt4Line4c_MiddleName[0]")
            .setText(user.data.application.middle_name?.toUpperCase());
        }

        // Sex

        if (user.data.application.basicinfo_name == "Male") {
          form.getCheckBox("form1[0].#subform[4].Pt4Line9_Male[0]").check();
        } else {
          form.getCheckBox("form1[0].#subform[4].Pt4Line9_Male[0]").uncheck();
        }

        if (user.data.application.basicinfo_name == "Female") {
          form.getCheckBox("form1[0].#subform[4].Pt4Line9_Female[0]").check();
        } else {
          form.getCheckBox("form1[0].#subform[4].Pt4Line9_Female[0]").uncheck();
        }

   
        if (user.data.application.citizenship_name) {
          form
            .getTextField("form1[0].#subform[4].Pt4Line9_DateOfBirth[0]")
            .setText(dateFormatter(user.data.application.citizenship_name));
        }

        if (user.data.application.sponsorfamily_name) {
          form
            .getTextField("form1[0].#subform[5].Pt4Line30a_FamilyName[0]")
            .setText(user.data.application.sponsorfamily_name?.toUpperCase());
        }

        if (user.data.application.sponsorname) {
          form
            .getTextField("form1[0].#subform[5].Pt4Line30b_GivenName[0]")
            .setText(user.data.application.sponsorname?.toUpperCase());
        }

        if (user.data.application.sponsormiddle_name) {
          form
            .getTextField("form1[0].#subform[5].Pt4Line30c_MiddleName[0]")
            .setText(user.data.application.sponsormiddle_name?.toUpperCase());
        }

        if (user.data.application.sponsormiddle_name) {
          form
            .getTextField("form1[0].#subform[5].Pt4Line31_Relationship[0]")
            .setText("SPOUSE");
        }


        if (user.data.application.insaidedateofbirrth_name) {
          form
            .getTextField("form1[0].#subform[5].Pt4Line32_DateOfBirth[0]")
            .setText(
              dateFormatter(user.data.application.insaidedateofbirrth_name)
            );
        }

        if (user.data.application.ofinsidesponsorbirth_name) {
          form
            .getTextField("form1[0].#subform[5].Pt4Line49_CountryOfBirth[0]")
            .setText(
              user.data.application.ofinsidesponsorbirth_name?.toUpperCase()
            );
        }

        // ---------------------------------------------------------------------------------------------------------------

        if (user.data.application.birth_name) {
          form
            .getTextField("form1[0].#subform[4].Pt4Line8_CountryOfBirth[0]")
            .setText(user.data.application.birth_name?.toUpperCase());
        }

        if (user.data.application.city_name) {
          form
            .getTextField("form1[0].#subform[4].Pt4Line7_CityTownOfBirth[0]")
            .setText(user.data.application.city_name?.toUpperCase());
        }

        // CHILD

        // Street number and name

        if (user.data.application.recentstreet_name) {
          form
            .getTextField("form1[0].#subform[4].Pt4Line13_StreetNumberName[0]")
            .setText(user.data.application.recentstreet_name?.toUpperCase());
        }

        // Apt./Ste./Flr. Number (if any)

        if (user.data.application.recentapt_name == "12") {
          form.getCheckBox("form1[0].#subform[4].Pt4Line13_Unit[0]").check();
        } else {
          form.getCheckBox("form1[0].#subform[4].Pt4Line13_Unit[0]").uncheck();
        }

        if (user.data.application.recentapt_name == "13") {
          form.getCheckBox("form1[0].#subform[4].Pt4Line13_Unit[1]").check();
        } else {
          form.getCheckBox("form1[0].#subform[4].Pt4Line13_Unit[1]").uncheck();
        }

        if (user.data.application.recentapt_name == "14") {
          form.getCheckBox("form1[0].#subform[4].Pt4Line13_Unit[2]").check();
        } else {
          form.getCheckBox("form1[0].#subform[4].Pt4Line13_Unit[2]").uncheck();
        }

        // Number (if any)

        if (user.data.application.recentste_name) {
          form
            .getTextField("form1[0].#subform[4].Pt4Line13_AptSteFlrNumber[0]")
            .setText(user.data.application.recentste_name?.toUpperCase());
        }

        // City or town

        if (user.data.application.recentcity_name) {
          form
            .getTextField("form1[0].#subform[4].Pt4Line13_CityOrTown[0]")
            .setText(user.data.application.recentcity_name?.toUpperCase());
        }

       

        // // Province

        if (user.data.application.recentprovince_name) {
          form
            .getTextField("form1[0].#subform[4].Pt4Line13_Province[0]")
            .setText(user.data.application.recentprovince_name?.toUpperCase());
        }

        // // ZIP Code

        // if (user.data.application.insideuscode_name) {
        // 	form.getTextField('form1[0].#subform[4].Pt4Line12e_ZipCode[0]').setText(user.data.application.insideuscode_name);
        // }

        // Postal code

        if (user.data.application.recentpostal_name) {
          form
            .getTextField("form1[0].#subform[4].Pt4Line13_PostalCode[0]")
            .setText(user.data.application.recentpostal_name?.toUpperCase());
        }

        // // Country

        if (user.data.application.recentcountry_name) {
          form
            .getTextField("form1[0].#subform[4].Pt4Line13_Country[0]")
            .setText(user.data.application.recentcountry_name?.toUpperCase());
        }

        // U.S. social security number

        if (
          user.data.application.securitynumberone_name +
          user.data.application.securitynumbertwo_name +
          user.data.application.securitynumberthree_name
        ) {
          form
            .getTextField("form1[0].#subform[4].Pt4Line3_SSN[0]")
            .setText(
              user.data.application.securitynumberone_name +
                user.data.application.securitynumbertwo_name +
                user.data.application.securitynumberthree_name
            );
        }

        if (
          user.data.application.sponsorsecuritynumberone_name +
          user.data.application.sponsorsecuritynumbertwo_name +
          user.data.application.sponsorsecuritynumberthree_name
        ) {
          form
            .getTextField("form1[0].#subform[0].Pt2Line11_SSN[0]")
            .setText(
              user.data.application.sponsorsecuritynumberone_name +
                user.data.application.sponsorsecuritynumbertwo_name +
                user.data.application.sponsorsecuritynumberthree_name
            );
        }

        // Place where applicant and sponsor physically lived together

        // CityOrTown

        if (user.data.application.togethertogether_name) {
          form
            .getTextField("form1[0].#subform[7].Pt4Line57_CityOrTown[0]")
            .setText(
              user.data.application.togethertogether_name?.toUpperCase()
            );
        }

        //ZipCode

        if (user.data.application.togetherlcodesponsor_name) {
          form
            .getTextField("form1[0].#subform[7].Pt4Line57_ZipCode[0]")
            .setText(
              user.data.application.togetherlcodesponsor_name?.toUpperCase()
            );
        }

        //State

        if (user.data.application.togetherincesponsor_name) {
          form
            .getDropdown("form1[0].#subform[7].Pt4Line57_State[0]")
            .select(user.data.application.togetherincesponsor_name);
        }

        //StreetNumberName

        if (user.data.application.streettogethersponsors_name) {
          form
            .getTextField("form1[0].#subform[7].Pt4Line57_StreetNumberName[0]")
            .setText(
              user.data.application.streettogethersponsors_name?.toUpperCase()
            );
        }
        //AptSteFlrNumber

        if (user.data.application.physicalusstetogether_name) {
          form
            .getTextField("form1[0].#subform[7].Pt4Line57_AptSteFlrNumber[0]")
            .setText(
              user.data.application.physicalusstetogether_name?.toUpperCase()
            );
        }

        if (user.data.application.togethersponsor_name == "Apt") {
          form.getCheckBox("form1[0].#subform[7].Pt4Line57_Unit[0]").check();
        } else {
          form.getCheckBox("form1[0].#subform[7].Pt4Line57_Unit[0]").uncheck();
        }

        if (user.data.application.togethersponsor_name == "Ste") {
          form.getCheckBox("form1[0].#subform[7].Pt4Line57_Unit[1]").check();
        } else {
          form.getCheckBox("form1[0].#subform[7].Pt4Line57_Unit[1]").uncheck();
        }

        if (user.data.application.togethersponsor_name == "Flr") {
          form.getCheckBox("form1[0].#subform[7].Pt4Line57_Unit[2]").check();
        } else {
          form.getCheckBox("form1[0].#subform[7].Pt4Line57_Unit[2]").uncheck();
        }

        if (user.data.application.togetherprovinceplace_name) {
          form
            .getTextField("form1[0].#subform[7].Pt4Line57_Province[0]")
            .setText(
              user.data.application.togetherprovinceplace_name?.toUpperCase()
            );
        }

        if (user.data.application.togethercountry_name) {
          form
            .getTextField("form1[0].#subform[7].Pt4Line57_Country[0]")
            .setText(user.data.application.togethercountry_name?.toUpperCase());
        }

        if (user.data.application.togetherpostalcodeplace_name) {
          form
            .getTextField("form1[0].#subform[7].Pt4Line57_PostalCode[0]")
            .setText(
              user.data.application.togetherpostalcodeplace_name?.toUpperCase()
            );
        }

        // Employer sponsor info

        if (
          Array.isArray(user.data.application.sponsoremploymentfiveyears_names)
        ) {
          if (
            user.data.application.sponsoremploymentfiveyears_names.length > 0
          ) {
            // Name of employer or company

            if (
              user.data.application.sponsoremploymentfiveyears_names[0]
                .admissiontown_name
            ) {
              form
                .getTextField(
                  "form1[0].#subform[3].Pt2Line40_EmployerOrCompName[0]"
                )
                .setText(
                  user.data.application.sponsoremploymentfiveyears_names[0].admissiontown_name
                    ?.toUpperCase()
                    ?.slice(0, 34)
                );
            }

            // Street number and name

            if (
              user.data.application.sponsoremploymentfiveyears_names[0]
                .togetheremployer_name
            ) {
              form
                .getTextField(
                  "form1[0].#subform[3].Pt2Line41_StreetNumberName[0]"
                )
                .setText(
                  user.data.application.sponsoremploymentfiveyears_names[0].togetheremployer_name
                    ?.toUpperCase()
                    ?.slice(0, 34)
                );
            }

            // Apt./Ste./Flr. Number (if any)

            if (
              user.data.application.sponsoremploymentfiveyears_names[0]
                .employersponsor_name == "Apt"
            ) {
              form
                .getCheckBox("form1[0].#subform[3].Pt2Line41_Unit[0]")
                .check();
            } else {
              form
                .getCheckBox("form1[0].#subform[3].Pt2Line41_Unit[0]")
                .uncheck();
            }

            if (
              user.data.application.sponsoremploymentfiveyears_names[0]
                .employersponsor_name == "Ste"
            ) {
              form
                .getCheckBox("form1[0].#subform[3].Pt2Line41_Unit[1]")
                .check();
            } else {
              form
                .getCheckBox("form1[0].#subform[3].Pt2Line41_Unit[1]")
                .uncheck();
            }

            if (
              user.data.application.sponsoremploymentfiveyears_names[0]
                .employersponsor_name == "Flr"
            ) {
              form
                .getCheckBox("form1[0].#subform[3].Pt2Line41_Unit[2]")
                .check();
            } else {
              form
                .getCheckBox("form1[0].#subform[3].Pt2Line41_Unit[2]")
                .uncheck();
            }

            // Number (if any)

            if (
              user.data.application.sponsoremploymentfiveyears_names[0]
                .sponsorphysicalusstetogether_name
            ) {
              form
                .getTextField(
                  "form1[0].#subform[3].Pt2Line41_AptSteFlrNumber[0]"
                )
                .setText(
                  user.data.application.sponsoremploymentfiveyears_names[0].sponsorphysicalusstetogether_name?.toUpperCase()
                );
            }

            // City or town

            if (
              user.data.application.sponsoremploymentfiveyears_names[0]
                .employertogether_name
            ) {
              form
                .getTextField("form1[0].#subform[3].Pt2Line41_CityOrTown[0]")
                .setText(
                  user.data.application.sponsoremploymentfiveyears_names[0].employertogether_name?.toUpperCase()
                );
            }

            // State

            if (
              user.data.application.sponsoremploymentfiveyears_names[0]
                .togetherinceemployer_name
            ) {
              form
                .getDropdown("form1[0].#subform[3].Pt2Line41_State[0]")
                .select(
                  user.data.application.sponsoremploymentfiveyears_names[0]
                    .togetherinceemployer_name
                );
            }

            // Occupation

            if (
              user.data.application.sponsoremploymentfiveyears_names[0]
                .admissionoccupation_name
            ) {
              form
                .getTextField("form1[0].#subform[3].Pt2Line42_Occupation[0]")
                .setText(
                  user.data.application.sponsoremploymentfiveyears_names[0].admissionoccupation_name?.toUpperCase()
                );
            }

            // Province

            if (
              user.data.application.sponsoremploymentfiveyears_names[0]
                .employerprovinceplace_name
            ) {
              form
                .getTextField("form1[0].#subform[3].Pt2Line41_Province[0]")
                .setText(
                  user.data.application.sponsoremploymentfiveyears_names[0].employerprovinceplace_name?.toUpperCase()
                );
            }
            // ZIP Code

            if (
              user.data.application.sponsoremploymentfiveyears_names[0]
                .togetherlcodeemployer_name
            ) {
              form
                .getTextField("form1[0].#subform[3].Pt2Line41_ZipCode[0]")
                .setText(
                  user.data.application.sponsoremploymentfiveyears_names[0].togetherlcodeemployer_name?.toUpperCase()
                );
            }
            // Postal code

            if (
              user.data.application.sponsoremploymentfiveyears_names[0]
                .employerpostalcodeplace_name
            ) {
              form
                .getTextField("form1[0].#subform[3].Pt2Line41_PostalCode[0]")
                .setText(
                  user.data.application.sponsoremploymentfiveyears_names[0].employerpostalcodeplace_name?.toUpperCase()
                );
            }

            // Country

            if (
              user.data.application.sponsoremploymentfiveyears_names[0]
                .employercountry_name
            ) {
              form
                .getTextField("form1[0].#subform[3].Pt2Line41_Country[0]")
                .setText(
                  user.data.application.sponsoremploymentfiveyears_names[0].employercountry_name?.toUpperCase()
                );
            }

            if (
              user.data.application.sponsoremploymentfiveyears_names[0]
                .employmentstart_name
            ) {
              form
                .getTextField("form1[0].#subform[3].Pt2Line43a_DateFrom[0]")
                .setText(
                  dateFormatter(
                    user.data.application.sponsoremploymentfiveyears_names[0]
                      .employmentstart_name
                  )
                );
            }

            if (
              user.data.application.sponsoremploymentfiveyears_names[0]
                .employmentend_name
            ) {
              form
                .getTextField("form1[0].#subform[3].Pt2Line43b_DateTo[0]")
                .setText(
                  dateFormatter(
                    user.data.application.sponsoremploymentfiveyears_names[0]
                      .employmentend_name
                  )
                );
            }
          }

          if (
            user.data.application.sponsoremploymentfiveyears_names.length > 1
          ) {
            // Name of employer or company

            if (
              user.data.application.sponsoremploymentfiveyears_names[1]
                .admissiontown_name
            ) {
              form
                .getTextField(
                  "form1[0].#subform[3].Pt2Line44_EmployerOrOrgName[0]"
                )
                .setText(
                  user.data.application.sponsoremploymentfiveyears_names[1].admissiontown_name
                    ?.toUpperCase()
                    .slice(0, 34)
                );
            }

            // Street number and name

            if (
              user.data.application.sponsoremploymentfiveyears_names[1]
                .togetheremployer_name
            ) {
              form
                .getTextField(
                  "form1[0].#subform[3].Pt2Line45_StreetNumberName[0]"
                )
                .setText(
                  user.data.application.sponsoremploymentfiveyears_names[1].togetheremployer_name?.toUpperCase()
                );
            }

            // Apt./Ste./Flr. Number (if any)

            if (
              user.data.application.sponsoremploymentfiveyears_names[1]
                .employersponsor_name == "Apt"
            ) {
              form
                .getCheckBox("form1[0].#subform[3].Pt2Line45_Unit[0]")
                .check();
            } else {
              form
                .getCheckBox("form1[0].#subform[3].Pt2Line45_Unit[0]")
                .uncheck();
            }

            if (
              user.data.application.sponsoremploymentfiveyears_names[1]
                .employersponsor_name == "Ste"
            ) {
              form
                .getCheckBox("form1[0].#subform[3].Pt2Line45_Unit[1]")
                .check();
            } else {
              form
                .getCheckBox("form1[0].#subform[3].Pt2Line45_Unit[1]")
                .uncheck();
            }

            if (
              user.data.application.sponsoremploymentfiveyears_names[1]
                .employersponsor_name == "Flr"
            ) {
              form
                .getCheckBox("form1[0].#subform[3].Pt2Line45_Unit[2]")
                .check();
            } else {
              form
                .getCheckBox("form1[0].#subform[3].Pt2Line45_Unit[2]")
                .uncheck();
            }

            // Number (if any)

            if (
              user.data.application.sponsoremploymentfiveyears_names[1]
                .sponsorphysicalusstetogether_name
            ) {
              form
                .getTextField(
                  "form1[0].#subform[3].Pt2Line45_AptSteFlrNumber[0]"
                )
                .setText(
                  user.data.application.sponsoremploymentfiveyears_names[1].sponsorphysicalusstetogether_name?.toUpperCase()
                );
            }

            // City or town

            if (
              user.data.application.sponsoremploymentfiveyears_names[1]
                .employertogether_name
            ) {
              form
                .getTextField("form1[0].#subform[3].Pt2Line45_CityOrTown[0]")
                .setText(
                  user.data.application.sponsoremploymentfiveyears_names[1].employertogether_name?.toUpperCase()
                );
            }

            // State

            if (
              user.data.application.sponsoremploymentfiveyears_names[1]
                .togetherinceemployer_name
            ) {
              form
                .getDropdown("form1[0].#subform[3].Pt2Line45_State[0]")
                .select(
                  user.data.application.sponsoremploymentfiveyears_names[1]
                    .togetherinceemployer_name
                );
            }

            // Occupation

            if (
              user.data.application.sponsoremploymentfiveyears_names[1]
                .admissionoccupation_name
            ) {
              form
                .getTextField("form1[0].#subform[3].Pt2Line46_Occupation[0]")
                .setText(
                  user.data.application.sponsoremploymentfiveyears_names[1].admissionoccupation_name?.toUpperCase()
                );
            }

            // Province

            if (
              user.data.application.sponsoremploymentfiveyears_names[1]
                .employerprovinceplace_name
            ) {
              form
                .getTextField("form1[0].#subform[3].Pt2Line45_Province[0]")
                .setText(
                  user.data.application.sponsoremploymentfiveyears_names[1].employerprovinceplace_name?.toUpperCase()
                );
            }
            // ZIP Code

            if (
              user.data.application.sponsoremploymentfiveyears_names[1]
                .togetherlcodeemployer_name
            ) {
              form
                .getTextField("form1[0].#subform[3].Pt2Line45_ZipCode[0]")
                .setText(
                  user.data.application.sponsoremploymentfiveyears_names[1].togetherlcodeemployer_name?.toUpperCase()
                );
            }
            // Postal code

            if (
              user.data.application.sponsoremploymentfiveyears_names[1]
                .employerpostalcodeplace_name
            ) {
              form
                .getTextField("form1[0].#subform[3].Pt2Line45_PostalCode[0]")
                .setText(
                  user.data.application.sponsoremploymentfiveyears_names[1].employerpostalcodeplace_name?.toUpperCase()
                );
            }

            // Country

            if (
              user.data.application.sponsoremploymentfiveyears_names[1]
                .employercountry_name
            ) {
              form
                .getTextField("form1[0].#subform[3].Pt2Line45_Country[0]")
                .setText(
                  user.data.application.sponsoremploymentfiveyears_names[1].employercountry_name?.toUpperCase()
                );
            }

          
            if (
              user.data.application.sponsoremploymentfiveyears_names[1]
                .employmentstart_name
            ) {
              form
                .getTextField("form1[0].#subform[3].Pt2Line47a_DateFrom[0]")
                .setText(
                  dateFormatter(
                    user.data.application.sponsoremploymentfiveyears_names[1]
                      .employmentstart_name
                  )
                );
            }

        
            if (
              user.data.application.sponsoremploymentfiveyears_names[1]
                .admissiontownnn_name
            ) {
              form
                .getTextField("form1[0].#subform[3].Pt2Line47b_DateTo[0]")
                .setText(
                  dateFormatter(
                    user.data.application.sponsoremploymentfiveyears_names[1]
                      .admissiontownnn_name
                  )
                );
            }
          }
        }

        if (user.data.application.marriedmarried_name) {
          form
            .getTextField("form1[0].#subform[1].Pt2Line16_NumberofMarriages[0]")
            .setText(user.data.application.marriedmarried_name?.toUpperCase());
        }

        if (Array.isArray(user.data.application.marriagessponsor_names)) {
          if (user.data.application.marriagessponsor_names.length > 0) {
            if (
              user.data.application.marriagessponsor_names[0].familysponsor_name
            ) {
              form
                .getTextField("form1[0].#subform[2].Pt2Line22a_FamilyName[0]")
                .setText(
                  user.data.application.marriagessponsor_names[0].familysponsor_name?.toUpperCase()
                );
            }

            if (
              user.data.application.marriagessponsor_names[0].mothersponsor_name
            ) {
              form
                .getTextField("form1[0].#subform[2].Pt2Line22b_GivenName[0]")
                .setText(
                  user.data.application.marriagessponsor_names[0].mothersponsor_name?.toUpperCase()
                );
            }

            if (
              user.data.application.marriagessponsor_names[0].middlesponsor_name
            ) {
              form
                .getTextField("form1[0].#subform[2].Pt2Line22c_MiddleName[0]")
                .setText(
                  user.data.application.marriagessponsor_names[0].middlesponsor_name?.toUpperCase()
                );
            }
            if (
              user.data.application.marriagessponsor_names[0]
                .marriagedatesponsor_name
            ) {
              form
                .getTextField(
                  "form1[0].#subform[2].Pt2Line23_DateMarriageEnded[0]"
                )
                .setText(
                  dateFormatter(
                    user.data.application.marriagessponsor_names[0]
                      .marriagedatesponsor_name
                  )
                );
            }
          }
        }

        
        if (user.data.application.marriagedate_name) {
          form
            .getTextField("form1[0].#subform[2].Pt2Line18_DateOfMarriage[0]")
            .setText(dateFormatter(user.data.application.marriagedate_name));
        }

        // JERRY's biographic info

        // Ethnicity

        if (user.data.application.latino_name == "Not Hispanic or Latino") {
          form
            .getCheckBox("form1[0].#subform[3].Pt3Line1_Ethnicity[0]")
            .check();
        } else {
          form
            .getCheckBox("form1[0].#subform[3].Pt3Line1_Ethnicity[0]")
            .uncheck();
        }
        if (user.data.application.latino_name == "Hispanic or Latino") {
          form
            .getCheckBox("form1[0].#subform[3].Pt3Line1_Ethnicity[1]")
            .check();
        } else {
          form
            .getCheckBox("form1[0].#subform[3].Pt3Line1_Ethnicity[1]")
            .uncheck();
        }

        // Race

        if (user.data.application.white_name) {
          form
            .getCheckBox("form1[0].#subform[3].Pt3Line2_Race_White[0]")
            .check();
        }

        if (user.data.application.asian_name) {
          form
            .getCheckBox("form1[0].#subform[3].Pt3Line2_Race_Asian[0]")
            .check();
        }

        if (user.data.application.africanamerican_name) {
          form
            .getCheckBox("form1[0].#subform[3].Pt3Line2_Race_Black[0]")
            .check();
        }

        if (user.data.application.alaskanative_name) {
          form
            .getCheckBox(
              "form1[0].#subform[3].Pt3Line2_Race_AmericanIndianAlaskaNative[0]"
            )
            .check();
        }

        if (user.data.application.hawaiianor_name) {
          form
            .getCheckBox(
              "form1[0].#subform[3].Pt3Line2_Race_NativeHawaiianOtherPacificIslander[0]"
            )
            .check();
        }

        // Sponsor

        if (user.data.application.anumbersponsoraccount_name) {
          form
            .getTextField(
              "form1[0].#subform[0].#area[5].Pt2Line2_USCISOnlineActNumber[0]"
            )
            .setText(user.data.application.anumbersponsoraccount_name);
        }

        if (user.data.application.anumbersponsor_name) {
          form
            .getTextField(
              "form1[0].#subform[0].#area[4].Pt2Line1_AlienNumber[0]"
            )
            .setText(user.data.application.anumbersponsor_name);
        }

        // Eye color

        if (user.data.application.eye_name == "Blue") {
          form.getCheckBox("form1[0].#subform[3].Pt3Line5_EyeColor[0]").check();
        } else {
          form
            .getCheckBox("form1[0].#subform[3].Pt3Line5_EyeColor[0]")
            .uncheck();
        }

        if (user.data.application.eye_name == "Brown") {
          form.getCheckBox("form1[0].#subform[3].Pt3Line5_EyeColor[1]").check();
        } else {
          form
            .getCheckBox("form1[0].#subform[3].Pt3Line5_EyeColor[1]")
            .uncheck();
        }

        if (user.data.application.eye_name == "Hazel") {
          form.getCheckBox("form1[0].#subform[3].Pt3Line5_EyeColor[2]").check();
        } else {
          form
            .getCheckBox("form1[0].#subform[3].Pt3Line5_EyeColor[2]")
            .uncheck();
        }

        if (user.data.application.eye_name == "Pink") {
          form.getCheckBox("form1[0].#subform[3].Pt3Line5_EyeColor[3]").check();
        } else {
          form
            .getCheckBox("form1[0].#subform[3].Pt3Line5_EyeColor[3]")
            .uncheck();
        }

        if (user.data.application.eye_name == "Maroon") {
          form.getCheckBox("form1[0].#subform[3].Pt3Line5_EyeColor[4]").check();
        } else {
          form
            .getCheckBox("form1[0].#subform[3].Pt3Line5_EyeColor[4]")
            .uncheck();
        }

        if (user.data.application.eye_name == "Green") {
          form.getCheckBox("form1[0].#subform[3].Pt3Line5_EyeColor[5]").check();
        } else {
          form
            .getCheckBox("form1[0].#subform[3].Pt3Line5_EyeColor[5]")
            .uncheck();
        }

        if (user.data.application.eye_name == "Gray") {
          form.getCheckBox("form1[0].#subform[3].Pt3Line5_EyeColor[6]").check();
        } else {
          form
            .getCheckBox("form1[0].#subform[3].Pt3Line5_EyeColor[6]")
            .uncheck();
        }

        if (user.data.application.eye_name == "Black") {
          form.getCheckBox("form1[0].#subform[3].Pt3Line5_EyeColor[7]").check();
        } else {
          form
            .getCheckBox("form1[0].#subform[3].Pt3Line5_EyeColor[7]")
            .uncheck();
        }

        if (user.data.application.eye_name == "Unknown") {
          form.getCheckBox("form1[0].#subform[3].Pt3Line5_EyeColor[8]").check();
        } else {
          form
            .getCheckBox("form1[0].#subform[3].Pt3Line5_EyeColor[8]")
            .uncheck();
        }

        // Hair color

        if (user.data.application.hair_name == "Bold") {
          form
            .getCheckBox("form1[0].#subform[4].Pt3Line6_HairColor[0]")
            .check();
        } else {
          form
            .getCheckBox("form1[0].#subform[4].Pt3Line6_HairColor[0]")
            .uncheck();
        }

        if (user.data.application.hair_name == "Black") {
          form
            .getCheckBox("form1[0].#subform[4].Pt3Line6_HairColor[1]")
            .check();
        } else {
          form
            .getCheckBox("form1[0].#subform[4].Pt3Line6_HairColor[1]")
            .uncheck();
        }

        if (user.data.application.hair_name == "Blond") {
          form
            .getCheckBox("form1[0].#subform[4].Pt3Line6_HairColor[2]")
            .check();
        } else {
          form
            .getCheckBox("form1[0].#subform[4].Pt3Line6_HairColor[2]")
            .uncheck();
        }

        if (user.data.application.hair_name == "Brown") {
          form
            .getCheckBox("form1[0].#subform[4].Pt3Line6_HairColor[3]")
            .check();
        } else {
          form
            .getCheckBox("form1[0].#subform[4].Pt3Line6_HairColor[3]")
            .uncheck();
        }

        if (user.data.application.hair_name == "Gray") {
          form
            .getCheckBox("form1[0].#subform[4].Pt3Line6_HairColor[4]")
            .check();
        } else {
          form
            .getCheckBox("form1[0].#subform[4].Pt3Line6_HairColor[4]")
            .uncheck();
        }

        if (user.data.application.hair_name == "Red") {
          form
            .getCheckBox("form1[0].#subform[4].Pt3Line6_HairColor[5]")
            .check();
        } else {
          form
            .getCheckBox("form1[0].#subform[4].Pt3Line6_HairColor[5]")
            .uncheck();
        }

        if (user.data.application.hair_name == "Sandy") {
          form
            .getCheckBox("form1[0].#subform[4].Pt3Line6_HairColor[6]")
            .check();
        } else {
          form
            .getCheckBox("form1[0].#subform[4].Pt3Line6_HairColor[6]")
            .uncheck();
        }

        if (user.data.application.hair_name == "White") {
          form
            .getCheckBox("form1[0].#subform[4].Pt3Line6_HairColor[7]")
            .check();
        } else {
          form
            .getCheckBox("form1[0].#subform[4].Pt3Line6_HairColor[7]")
            .uncheck();
        }

        if (user.data.application.hair_name == "Unknown") {
          form
            .getCheckBox("form1[0].#subform[4].Pt3Line6_HairColor[8]")
            .check();
        } else {
          form
            .getCheckBox("form1[0].#subform[4].Pt3Line6_HairColor[8]")
            .uncheck();
        }

        if (user.data.application.togetherdatefrom_name) {
          form
            .getTextField("form1[0].#subform[7].Pt4Line58a_DateFrom[0]")
            .setText(
              dateFormatter(user.data.application.togetherdatefrom_name)
            );
        }

      

        if (user.data.application.togetherdateto_name) {
          form
            .getTextField("form1[0].#subform[7].Pt4Line58b_DateTo[0]")
            .setText(dateFormatter(user.data.application.togetherdateto_name));
        }

        // Province

        if (user.data.application.togetherprovinceplace_name) {
          form
            .getTextField("form1[0].#subform[7].Pt4Line57_Province[0]")
            .setText(
              user.data.application.togetherprovinceplace_name?.toUpperCase()
            );
        }

        // Country

        if (user.data.application.togethercountry_name) {
          form
            .getTextField("form1[0].#subform[7].Pt4Line57_Country[0]")
            .setText(user.data.application.togethercountry_name?.toUpperCase());
        }

        // Postal code

        if (user.data.application.togetherpostalcodeplace_name) {
          form
            .getTextField("form1[0].#subform[7].Pt4Line57_PostalCode[0]")
            .setText(
              user.data.application.togetherpostalcodeplace_name?.toUpperCase()
            );
        }

        // Tick Married

        if (user.data.application.name) {
          form.getCheckBox("form1[0].#subform[1].Pt2Line17_Married[0]").check();
        } else {
          form
            .getCheckBox("form1[0].#subform[1].Pt2Line17_Married[0]")
            .uncheck();
        }

        if (user.data.application.sponsorobtained_name == "yes") {
          form.getCheckBox("form1[0].#subform[2].Pt2Line36_Yes[0]").check();
        } else {
          form.getCheckBox("form1[0].#subform[2].Pt2Line36_Yes[0]").uncheck();
        }

        if (user.data.application.sponsorobtained_name == "no") {
          form.getCheckBox("form1[0].#subform[2].Pt2Line36_No[0]").check();
        } else {
          form.getCheckBox("form1[0].#subform[2].Pt2Line36_No[0]").uncheck();
        }

        // if (user.data.application.admissionstate_name) {
        // form.getDropdown('form1[0].#subform[3].Pt2Line41_State[0]').select(user.data.application.admissionstate_name);
        // }

        // Weight

        if (user.data.application.sponsoruspounds_name) {
          form
            .getTextField("form1[0].#subform[3].Pt3Line4_Pound1[0]")
            .setText(user.data.application.sponsoruspounds_name);
        }

        if (user.data.application.sponsoruspoundsa_name) {
          form
            .getTextField("form1[0].#subform[3].Pt3Line4_Pound2[0]")
            .setText(user.data.application.sponsoruspoundsa_name);
        }

        if (user.data.application.sponsoruspoundss_name) {
          form
            .getTextField("form1[0].#subform[3].Pt3Line4_Pound3[0]")
            .setText(user.data.application.sponsoruspoundss_name);
        }

        // Height

        if (user.data.application.sponsorusfeet_name) {
          form
            .getDropdown("form1[0].#subform[3].Pt3Line3_HeightFeet[0]")
            .select(user.data.application.sponsorusfeet_name);
        }

        if (user.data.application.sponsorusinches_name) {
          form
            .getDropdown("form1[0].#subform[3].Pt3Line3_HeightInches[0]")
            .select(user.data.application.sponsorusinches_name);
        }

        // Relative 1

        if (Array.isArray(user.data.application.sponsorrelative_names)) {
          if (user.data.application.sponsorrelative_names.length > 0) {
            if (
              user.data.application.sponsorrelative_names[0].smother_family_name
            ) {
              form
                .getTextField("form1[0].#subform[7].Pt4Line6a_FamilyName[0]")
                .setText(
                  user.data.application.sponsorrelative_names[0].smother_family_name?.toUpperCase()
                );
            }

            if (user.data.application.sponsorrelative_names[0].smother_name) {
              form
                .getTextField("form1[0].#subform[7].Pt4Line6b_GivenName[0]")
                .setText(
                  user.data.application.sponsorrelative_names[0].smother_name?.toUpperCase()
                );
            }

            if (
              user.data.application.sponsorrelative_names[0].mother_smiddle_name
            ) {
              form
                .getTextField("form1[0].#subform[7].Pt4Line6c_MiddleName[0]")
                .setText(
                  user.data.application.sponsorrelative_names[0].mother_smiddle_name?.toUpperCase()
                );
            }
            if (
              user.data.application.sponsorrelative_names[0].srelationship_name
            ) {
              form
                .getTextField("form1[0].#subform[7].Pt4Line7_Relationship[0]")
                .setText(
                  user.data.application.sponsorrelative_names[0].srelationship_name?.toUpperCase()
                );
            }
          }
          if (user.data.application.sponsorrelative_names.length > 1) {
            if (
              user.data.application.sponsorrelative_names[1].smother_family_name
            ) {
              form
                .getTextField("form1[0].#subform[8].Pt4Line8a_FamilyName[0]")
                .setText(
                  user.data.application.sponsorrelative_names[1].smother_family_name?.toUpperCase()
                );
            }

            if (user.data.application.sponsorrelative_names[1].smother_name) {
              form
                .getTextField("form1[0].#subform[8].Pt4Line8b_GivenName[0]")
                .setText(
                  user.data.application.sponsorrelative_names[1].smother_name?.toUpperCase()
                );
            }

            if (
              user.data.application.sponsorrelative_names[1].mother_smiddle_name
            ) {
              form
                .getTextField("form1[0].#subform[8].Pt4Line8c_MiddleName[0]")
                .setText(
                  user.data.application.sponsorrelative_names[1].mother_smiddle_name?.toUpperCase()
                );
            }
            if (
              user.data.application.sponsorrelative_names[1].srelationship_name
            ) {
              form
                .getTextField("form1[0].#subform[8].Pt4Line9_Relationship[0]")
                .setText(
                  user.data.application.sponsorrelative_names[1].srelationship_name?.toUpperCase()
                );
            }
          }
        }

      
        // PREVIOUS PETITION

        if (user.data.application.sponsoreverpreviously_name == "yes") {
          form.getCheckBox("form1[0].#subform[7].Part4Line1_Yes[0]").check();
        } else {
          form.getCheckBox("form1[0].#subform[7].Part4Line1_Yes[0]").uncheck();
        }

        if (user.data.application.sponsoreverpreviously_name == "no") {
          form.getCheckBox("form1[0].#subform[7].Part4Line1_No[0]").check();
        } else {
          form.getCheckBox("form1[0].#subform[7].Part4Line1_No[0]").uncheck();
        }

        if (Array.isArray(user.data.application.sponsoralienprevious_names)) {
          if (user.data.application.sponsoralienprevious_names.length > 0) {
            if (
              user.data.application.sponsoralienprevious_names[0]
                .familyalien_name
            ) {
              form
                .getTextField("form1[0].#subform[7].Pt5Line2a_FamilyName[0]")
                .setText(
                  user.data.application.sponsoralienprevious_names[0].familyalien_name?.toUpperCase()
                );
            }

            if (
              user.data.application.sponsoralienprevious_names[0].alien_name
            ) {
              form
                .getTextField("form1[0].#subform[7].Pt5Line2b_GivenName[0]")
                .setText(
                  user.data.application.sponsoralienprevious_names[0].alien_name?.toUpperCase()
                );
            }

            if (
              user.data.application.sponsoralienprevious_names[0]
                .alienmiddle_name
            ) {
              form
                .getTextField("form1[0].#subform[7].Pt5Line2c_MiddleName[0]")
                .setText(
                  user.data.application.sponsoralienprevious_names[0].alienmiddle_name?.toUpperCase()
                );
            }

            if (
              user.data.application.sponsoralienprevious_names[0]
                .aliengreen_name
            ) {
              form
                .getTextField("form1[0].#subform[7].Pt5Line5_Result[0]")
                .setText(
                  user.data.application.sponsoralienprevious_names[0].aliengreen_name?.toUpperCase()
                );
            }

            if (
              user.data.application.sponsoralienprevious_names[0]
                .greenaliencity_name
            ) {
              form
                .getTextField("form1[0].#subform[7].Pt5Line4_DateFiled[0]")
                .setText(
                  dateFormatter(
                    user.data.application.sponsoralienprevious_names[0]
                      .greenaliencity_name
                  )
                );
            }

            if (
              user.data.application.sponsoralienprevious_names[0]
                .aliencitygreen_name
            ) {
              form
                .getTextField("form1[0].#subform[7].Pt5Line3a_CityOrTown[0]")
                .setText(
                  user.data.application.sponsoralienprevious_names[0].aliencitygreen_name?.toUpperCase()
                );
            }

            if (
              user.data.application.sponsoralienprevious_names[0]
                .alienstate_name
            ) {
              form
                .getDropdown("form1[0].#subform[7].Pt5Line3b_State[0]")
                .select(
                  user.data.application.sponsoralienprevious_names[0].alienstate_name?.toUpperCase()
                );
            }
          }
        }

        if (user.data.application.classadmission_name) {
          form
            .getTextField("form1[0].#subform[3].Pt2Line40a_ClassOfAdmission[0]")
            .setText(user.data.application.classadmission_name?.toUpperCase());
        }

        if (user.data.application.admissiondate_name) {
          form
            .getTextField("form1[0].#subform[3].Pt2Line40b_DateOfAdmission[0]")
            .setText(dateFormatter(user.data.application.admissiondate_name));
        }

        if (user.data.application.admissionstate_name) {
          form
            .getDropdown("form1[0].#subform[3].Pt2Line40e_State[0]")
            .select(user.data.application.admissionstate_name?.toUpperCase());
        }

        // USCitizen

        if (user.data.cardholder == "us") {
          form
            .getCheckBox("form1[0].#subform[2].Pt2Line36_USCitizen[0]")
            .check();
        } else {
          form
            .getCheckBox("form1[0].#subform[2].Pt2Line36_USCitizen[0]")
            .uncheck();
        }

        // LPR

        if (user.data.cardholder == "greencard") {
          form.getCheckBox("form1[0].#subform[2].Pt2Line36_LPR[0]").check();
        } else {
          form.getCheckBox("form1[0].#subform[2].Pt2Line36_LPR[0]").uncheck();
        }

        if (user.data.application.sponsoradministration_name == "yes") {
          form.getCheckBox("form1[0].#subform[3].Pt2Line41_Yes[0]").check();
        } else {
          form.getCheckBox("form1[0].#subform[3].Pt2Line41_Yes[0]").uncheck();
        }

        if (user.data.application.sponsoradministration_name == "no") {
          form.getCheckBox("form1[0].#subform[3].Pt2Line41_No[0]").check();
        } else {
          form.getCheckBox("form1[0].#subform[3].Pt2Line41_No[0]").uncheck();
        }

        if (user.data.application.sponsorname) {
          form
            .getTextField("form1[0].#subform[5].Pt4Line16b_GivenName[0]")
            .setText(user.data.application.sponsorname?.toUpperCase());
        }

        if (user.data.application.sponsormiddle_name) {
          form
            .getTextField("form1[0].#subform[5].Pt4Line16c_MiddleName[0]")
            .setText(user.data.application.sponsormiddle_name?.toUpperCase());
        }

        if (user.data.application.sponsorfamily_name) {
          form
            .getTextField("form1[0].#subform[5].Pt4Line16a_FamilyName[0]")
            .setText(user.data.application.sponsorfamily_name?.toUpperCase());
        }

        // Certificatenumber

        if (user.data.application.certificatenumber_name) {
          form
            .getTextField(
              "form1[0].#subform[2].Pt2Line37a_CertificateNumber[0]"
            )
            .setText(user.data.application.certificatenumber_name);
        }

        if (user.data.application.certificateissuance_name) {
          form
            .getTextField("form1[0].#subform[2].Pt2Line37b_PlaceOfIssuance[0]")
            .setText(
              user.data.application.certificateissuance_name?.toUpperCase()
            );
        }

        if (user.data.application.certificateissuancedate_name) {
          form
            .getTextField("form1[0].#subform[2].Pt2Line37c_DateOfIssuance[0]")
            .setText(
              dateFormatter(user.data.application.certificateissuancedate_name)
            );
        }

        // Perent 1

        if (user.data.application.splittleaboutfamilyname_name) {
          form
            .getTextField("form1[0].#subform[2].Pt2Line24_FamilyName[0]")
            .setText(
              user.data.application.splittleaboutfamilyname_name?.toUpperCase()
            );
        }

        if (user.data.application.splittleaboutname_name) {
          form
            .getTextField("form1[0].#subform[2].Pt2Line24_GivenName[0]")
            .setText(
              user.data.application.splittleaboutname_name?.toUpperCase()
            );
        }

        if (user.data.application.splittleaboutmiddname_name) {
          form
            .getTextField("form1[0].#subform[2].Pt2Line24_MiddleName[0]")
            .setText(
              user.data.application.splittleaboutmiddname_name?.toUpperCase()
            );
        }

        if (user.data.application.littleaboutcitytownvillage_name) {
          form
            .getTextField(
              "form1[0].#subform[2].Pt2Line28_CityTownOrVillageOfResidence[0]"
            )
            .setText(
              user.data.application.littleaboutcitytownvillage_name?.toUpperCase()
            );
        }

        if (user.data.application.littleaboutcountryofresidence_name) {
          form
            .getTextField(
              "form1[0].#subform[2].Pt2Line29_CountryOfResidence[0]"
            )
            .setText(
              user.data.application.littleaboutcountryofresidence_name?.toUpperCase()
            );
        }

        if (user.data.application.littleaboutcountryofbirth_name) {
          form
            .getTextField("form1[0].#subform[2].Pt2Line27_CountryofBirth[0]")
            .setText(
              user.data.application.littleaboutcountryofbirth_name?.toUpperCase()
            );
        }

        if (user.data.application.littleaboutdateofbirth_name) {
          form
            .getTextField("form1[0].#subform[2].Pt2Line25_DateofBirth[0]")
            .setText(
              dateFormatter(user.data.application.littleaboutdateofbirth_name)
            );
        }

        if (user.data.application.formrecordnumber_name) {
          form
            .getTextField(
              "form1[0].#subform[6].#area[8].Pt4Line21b_ArrivalDeparture[0]"
            )
            .setText(
              user.data.application.formrecordnumber_name?.toUpperCase()
            );
        }

        if (user.data.application.splittleaboutname_name) {
          form.getCheckBox("form1[0].#subform[2].Pt2Line26_Female[0]").check();
        } else {
          form
            .getCheckBox("form1[0].#subform[2].Pt2Line26_Female[0]")
            .uncheck();
        }

        // parent 2

        if (user.data.application.nowabautfathername_name) {
          form
            .getTextField("form1[0].#subform[2].Pt2Line30b_GivenName[0]")
            .setText(
              user.data.application.nowabautfathername_name?.toUpperCase()
            );
        }

        if (user.data.application.nowabautfathermiddle_name) {
          form
            .getTextField("form1[0].#subform[2].Pt2Line30c_MiddleName[0]")
            .setText(
              user.data.application.nowabautfathermiddle_name?.toUpperCase()
            );
        }

        if (user.data.application.nowabautfatherlastname_name) {
          form
            .getTextField("form1[0].#subform[2].Pt2Line30a_FamilyName[0]")
            .setText(
              user.data.application.nowabautfatherlastname_name?.toUpperCase()
            );
        }

        if (user.data.application.nowabautfatherresidence_name) {
          form
            .getTextField(
              "form1[0].#subform[2].Pt2Line35_CountryOfResidence[0]"
            )
            .setText(
              user.data.application.nowabautfatherresidence_name?.toUpperCase()
            );
        }

        if (user.data.application.nowabautfathercountry_name) {
          form
            .getTextField("form1[0].#subform[2].Pt2Line33_CountryofBirth[0]")
            .setText(
              user.data.application.nowabautfathercountry_name?.toUpperCase()
            );
        }

        if (user.data.application.nowabautfathercitytown_name) {
          form
            .getTextField(
              "form1[0].#subform[2].Pt2Line34_CityTownOrVillageOfResidence[0]"
            )
            .setText(
              user.data.application.nowabautfathercitytown_name?.toUpperCase()
            );
        }

        if (user.data.application.nowabautfatherbirth_name) {
          form
            .getTextField("form1[0].#subform[2].Pt2Line31_DateofBirth[0]")
            .setText(
              dateFormatter(user.data.application.nowabautfatherbirth_name)
            );
        }

        if (user.data.application.nowabautfathername_name) {
          form.getCheckBox("form1[0].#subform[2].Pt2Line32_Male[0]").check();
        } else {
          form.getCheckBox("form1[0].#subform[2].Pt2Line32_Male[0]").uncheck();
        }

        // About Jerry current marriage

        if (user.data.application.marriagecityortown_name) {
          form
            .getTextField("form1[0].#subform[2].Pt2Line19a_CityTown[0]")
            .setText(
              user.data.application.marriagecityortown_name?.toUpperCase()
            );
        }

        if (user.data.application.marriagestate_name) {
          form
            .getDropdown("form1[0].#subform[2].Pt2Line19b_State[0]")
            .select(user.data.application.marriagestate_name);
        }

        if (user.data.application.marriageprovince_name) {
          form
            .getTextField("form1[0].#subform[2].Pt2Line19c_Province[0]")
            .setText(
              user.data.application.marriageprovince_name?.toUpperCase()
            );
        }

        if (user.data.application.marriagecountry_name) {
          form
            .getTextField("form1[0].#subform[2].Pt2Line19d_Country[0]")
            .setText(user.data.application.marriagecountry_name?.toUpperCase());
        }

        // Daytime phone number

        if (user.data.application.phonenumber_name) {
          form
            .getTextField(
              "form1[0].#subform[4].Pt4Line14_DaytimePhoneNumber[0]"
            )
            .setText(user.data.application.phonenumber_name);
        }

        // Mobile phone number (if any)

        if (user.data.application.mobile_name) {
          form
            .getTextField("form1[0].#subform[5].Pt4Line15_MobilePhoneNumber[0]")
            .setText(user.data.application.mobile_name.toString());
        }

        // Email address (if any)

        if (user.data.application.register_name) {
          form
            .getTextField("form1[0].#subform[5].Pt4Line16_EmailAddress[0]")
            .setText(user.data.application.register_name?.toUpperCase());
        }

        // Immigration info

        if (user.data.application.travelpassportnumberus_name) {
          form
            .getTextField("form1[0].#subform[6].Pt4Line23_TravelDocNumber[0]")
            .setText(
              user.data.application.travelpassportnumberus_name?.toUpperCase()
            );
        }

        //Country of issuance

        if (user.data.application.traveluscountry_name) {
          form
            .getTextField("form1[0].#subform[6].Pt4Line24_CountryOfIssuance[0]")
            .setText(user.data.application.traveluscountry_name?.toUpperCase());
        }

        if (user.data.application.travelexpirationdateus_name) {
          form
            .getTextField("form1[0].#subform[6].Pt4Line25_ExpDate[0]")
            .setText(
              dateFormatter(user.data.application.travelexpirationdateus_name)
            );
        }

        // Passport number

        if (user.data.application.passportnumberus_name) {
          form
            .getTextField("form1[0].#subform[6].Pt4Line22_PassportNumber[0]")
            .setText(user.data.application.passportnumberus_name);
        }

        // Country of issuance

        if (user.data.application.uscountry_name) {
          form
            .getTextField("form1[0].#subform[6].Pt4Line24_CountryOfIssuance[0]")
            .setText(user.data.application.uscountry_name?.toUpperCase());
        }

        if (user.data.application.expirationdateus_name) {
          form
            .getTextField("form1[0].#subform[6].Pt4Line25_ExpDate[0]")
            .setText(
              dateFormatter(user.data.application.expirationdateus_name)
            );
        }

        // DaytimePhoneNumber

        if (user.data.application.phonenumbersponsor_name) {
          form
            .getTextField("form1[0].#subform[8].Pt6Line3_DaytimePhoneNumber[0]")
            .setText(user.data.application.phonenumbersponsor_name);
        }

        // Email

        if (user.data.application.insponsoremail_name) {
          form
            .getTextField("form1[0].#subform[8].Pt6Line5_Email[0]")
            .setText(user.data.application.insponsoremail_name?.toUpperCase());
        }

        // MobileNumber

        if (user.data.application.insponsormobile_name) {
          form
            .getTextField("form1[0].#subform[8].Pt6Line4_MobileNumber[0]")
            .setText(user.data.application.insponsormobile_name);
        }

        if (user.data.application.livingmarried_name) {
          form
            .getTextField("form1[0].#subform[5].Pt4Line17_NumberofMarriages[0]")
            .setText(user.data.application.livingmarried_name?.toUpperCase());
        }

        if (user.data.application.name) {
          form
            .getCheckBox("form1[0].#subform[5].Pt4Line18_MaritalStatus[4]")
            .check();
        }

        if (user.data.application.name) {
          form.getCheckBox("form1[0].#subform[6].Pt4Line20_Yes[0]").check();
        }

        if (user.data.application.marriagedate_name) {
          form
            .getTextField("form1[0].#subform[5].Pt4Line19_DateOfMarriage[0]")
            .setText(dateFormatter(user.data.application.marriagedate_name));
        }

        // Spouse

        if (user.data.application.name) {
          form.getCheckBox("form1[0].#subform[0].Pt1Line1_Spouse[0]").check();
        } else {
          form.getCheckBox("form1[0].#subform[0].Pt1Line1_Spouse[0]").uncheck();
        }

        if (user.data.application.uslastarrivaldate_name) {
          form
            .getTextField("form1[0].#subform[6].Pt4Line21c_DateOfArrival[0]")
            .setText(
              dateFormatter(user.data.application.uslastarrivaldate_name)
            );
        }

        if (user.data.application.form94_name) {
          form
            .getTextField("form1[0].#subform[6].Pt4Line21d_DateExpired[0]")
            .setText(dateFormatter(user.data.application.form94_name));
        }

        if (user.data.application.name) {
          form.getCheckBox("form1[0].#subform[8].Pt6Line1Checkbox[0]").check();
        }

        if (user.data.application.injudicialproceedings_name == "yes") {
          form.getCheckBox("form1[0].#subform[6].Pt4Line28_Yes[0]").check();
        } else {
          form.getCheckBox("form1[0].#subform[6].Pt4Line28_Yes[0]").uncheck();
        }

        if (user.data.application.injudicialproceedings_name == "no") {
          form.getCheckBox("form1[0].#subform[6].Pt4Line28_No[0]").check();
        } else {
          form.getCheckBox("form1[0].#subform[6].Pt4Line28_No[0]").uncheck();
        }

        // Immigration status on Form I-94

        if (user.data.application.form94middleform_name) {
          form
            .getDropdown("form1[0].#subform[6].Pt4Line21a_ClassOfAdmission[0]")
            .select(user.data.application.form94middleform_name);
        }

        // JERRY's Alien registration number (A-number) (if any)

        if (user.data.application.usregistrationnumber_name) {
          form
            .getTextField(
              "form1[0].#subform[4].#area[6].Pt4Line1_AlienNumber[0]"
            )
            .setText(user.data.application.usregistrationnumber_name);
        }

        // JERRY's USCIS Online Account Number (if any)

        if (user.data.application.filedapetition_name) {
          form
            .getTextField(
              "form1[0].#subform[4].#area[7].Pt4Line2_USCISOnlineActNumber[0]"
            )
            .setText(user.data.application.filedapetition_name);
        }

        // Yes/No/Unknown

        if (user.data.application.usfiledapetition_name == "yes") {
          form.getCheckBox("form1[0].#subform[4].Pt4Line10_Yes[0]").check();
        } else {
          form.getCheckBox("form1[0].#subform[4].Pt4Line10_Yes[0]").uncheck();
        }

        if (user.data.application.usfiledapetition_name == "no") {
          form.getCheckBox("form1[0].#subform[4].Pt4Line10_No[0]").check();
        } else {
          form.getCheckBox("form1[0].#subform[4].Pt4Line10_No[0]").uncheck();
        }

        if (user.data.application.usfiledapetition_name == "Unknown") {
          form.getCheckBox("form1[0].#subform[4].Pt4Line10_Unknown[0]");
        } else {
          form
            .getCheckBox("form1[0].#subform[4].Pt4Line10_Unknown[0]")
            .uncheck();
        }

     
        if (user.data.application.injudicialproceedings_name == "yes") {
          form.getCheckBox("form1[0].#subform[6].Pt4Line28_Yes[0]").check();
        } else {
          form.getCheckBox("form1[0].#subform[6].Pt4Line28_Yes[0]").uncheck();
        }

        if (user.data.application.injudicialproceedings_name == "no") {
          form.getCheckBox("form1[0].#subform[6].Pt4Line28_No[0]");
        } else {
          form.getCheckBox("form1[0].#subform[6].Pt4Line28_No[0]").uncheck();
        }

        if (user.data.application.expirationdateus_name) {
          form
            .getTextField("form1[0].#subform[6].Pt4Line25_ExpDate[0]")
            .setText(
              dateFormatter(user.data.application.expirationdateus_name)
            );
        }

        // City or town

        if (user.data.application.marriagecityortown_name) {
          form
            .getTextField("form1[0].#subform[5].Pt4Line20a_CityTown[0]")
            .setText(
              user.data.application.marriagecityortown_name?.toUpperCase()
            );
        }

        // State (if applicable)

        if (user.data.application.marriagestate_name) {
          form
            .getDropdown("form1[0].#subform[5].Pt4Line20b_State[0]")
            .select(user.data.application.marriagestate_name);
        }

        // Country

        if (user.data.application.marriagecountry_name) {
          form
            .getTextField("form1[0].#subform[5].Pt4Line20d_Country[0]")
            .setText(user.data.application.marriagecountry_name?.toUpperCase());
        }

        // Province (if applicable)

        if (user.data.application.marriageprovince_name) {
          form
            .getTextField("form1[0].#subform[5].Pt4Line20c_Province[0]")
            .setText(
              user.data.application.marriageprovince_name?.toUpperCase()
            );
        }

        // Does jerry have any prior marriages?

        if (Array.isArray(user.data.application.marriages_names)) {
          if (user.data.application.marriages_names.length) {
            if (user.data.application.marriages_names[0].motherfamily_name) {
              form
                .getTextField("form1[0].#subform[5].Pt4Line18a_FamilyName[0]")
                .setText(
                  user.data.application.marriages_names[0].motherfamily_name?.toUpperCase()
                );
            }

            if (user.data.application.marriages_names[0].mother_name) {
              form
                .getTextField("form1[0].#subform[5].Pt4Line18b_GivenName[0]")
                .setText(
                  user.data.application.marriages_names[0].mother_name?.toUpperCase()
                );
            }

            if (user.data.application.marriages_names[0].mothermiddle_name) {
              form
                .getTextField("form1[0].#subform[5].Pt4Line18c_MiddleName[0]")
                .setText(
                  user.data.application.marriages_names[0].mothermiddle_name?.toUpperCase()
                );
            }

            if (
              user.data.application.marriages_names[0]
                .marriagespousesdateofbirth_name
            ) {
              form
                .getTextField(
                  "form1[0].#subform[5].Pt4Line17_DateMarriageEnded[1]"
                )
                .setText(
                  dateFormatter(
                    user.data.application.marriages_names[0]
                      .marriagespousesdateofbirth_name
                  )
                );
            }
          }
        }

        // Does jerry have any prior marriages?

        if (user.data.application.family_name) {
          form
            .getTextField("form1[0].#subform[2].PtLine20a_FamilyName[0]")
            .setText(user.data.application.family_name?.toUpperCase());
        }

        if (user.data.application.name) {
          form
            .getTextField("form1[0].#subform[2].Pt2Line20b_GivenName[0]")
            .setText(user.data.application.name?.toUpperCase());
        }

        if (user.data.application.middle_name) {
          form
            .getTextField("form1[0].#subform[2].Pt2Line20c_MiddleName[0]")
            .setText(user.data.application.middle_name?.toUpperCase());
        }

        if (Array.isArray(user.data.application.children_names)) {
          if (user.data.application.children_names.length > 0) {
            if (
              user.data.application.children_names[0].childscurrentfamily_name
            ) {
              form
                .getTextField("form1[0].#subform[5].Pt4Line34a_FamilyName[0]")
                .setText(
                  user.data.application.children_names[0].childscurrentfamily_name?.toUpperCase()
                );
            }

            if (user.data.application.children_names[0].childscurrent_name) {
              form
                .getTextField("form1[0].#subform[5].Pt4Line34b_GivenName[0]")
                .setText(
                  user.data.application.children_names[0].childscurrent_name?.toUpperCase()
                );
            }

            if (
              user.data.application.children_names[0].childscurrentmiddele_name
            ) {
              form
                .getTextField("form1[0].#subform[5].Pt4Line34c_MiddleName[0]")
                .setText(
                  user.data.application.children_names[0].childscurrentmiddele_name?.toUpperCase()
                );
            }

            if (
              user.data.application.children_names[0].childscurrentmiddele_name
            ) {
              form
                .getTextField("form1[0].#subform[5].Pt4Line35_Relationship[0]")
                .setText("CHILD");
            }

            if (
              user.data.application.children_names[0]
                .childscurrentdatefobirth_name
            ) {
              form
                .getTextField("form1[0].#subform[5].Pt4Line36_DateOfBirth[0]")
                .setText(
                  dateFormatter(
                    user.data.application.children_names[0]
                      .childscurrentdatefobirth_name
                  )
                );
            }

            if (
              user.data.application.children_names[0]
                .childscurrentcountryofbirth_name
            ) {
              form
                .getTextField(
                  "form1[0].#subform[5].Pt4Line37_CountryOfBirth[0]"
                )
                .setText(
                  user.data.application.children_names[0].childscurrentcountryofbirth_name?.toUpperCase()
                );
            }
          }

          if (user.data.application.children_names.length > 1) {
            if (
              user.data.application.children_names[1].childscurrentfamily_name
            ) {
              form
                .getTextField("form1[0].#subform[5].Pt4Line38a_FamilyName[0]")
                .setText(
                  user.data.application.children_names[1].childscurrentfamily_name?.toUpperCase()
                );
            }

            if (user.data.application.children_names[1].childscurrent_name) {
              form
                .getTextField("form1[0].#subform[5].Pt4Line38b_GivenName[0]")
                .setText(
                  user.data.application.children_names[1].childscurrent_name?.toUpperCase()
                );
            }
            if (
              user.data.application.children_names[1].childscurrentmiddele_name
            ) {
              form
                .getTextField("form1[0].#subform[5].Pt4Line38c_MiddleName[0]")
                .setText(
                  user.data.application.children_names[1].childscurrentmiddele_name?.toUpperCase()
                );
            }

            if (
              user.data.application.children_names[1].childscurrentmiddele_name
            ) {
              form
                .getTextField("form1[0].#subform[5].Pt4Line39_Relationship[0]")
                .setText("CHILD");
            }

            if (
              user.data.application.children_names[1]
                .childscurrentdatefobirth_name
            ) {
              form
                .getTextField("form1[0].#subform[5].Pt4Line40_DateOfBirth[0]")
                .setText(
                  dateFormatter(
                    user.data.application.children_names[1]
                      .childscurrentdatefobirth_name
                  )
                );
            }

            if (
              user.data.application.children_names[1]
                .childscurrentcountryofbirth_name
            ) {
              form
                .getTextField(
                  "form1[0].#subform[5].Pt4Line41_CountryOfBirth[0]"
                )
                .setText(
                  user.data.application.children_names[1]
                    .childscurrentcountryofbirth_name
                );
            }
          }

          if (user.data.application.children_names.length > 2) {
            if (
              user.data.application.children_names[2].childscurrentfamily_name
            ) {
              form
                .getTextField("form1[0].#subform[6].Pt4Line42a_FamilyName[0]")
                .setText(
                  user.data.application.children_names[2].childscurrentfamily_name?.toUpperCase()
                );
            }
            if (user.data.application.children_names[2].childscurrent_name) {
              form
                .getTextField("form1[0].#subform[6].Pt4Line42b_GivenName[0]")
                .setText(
                  user.data.application.children_names[2].childscurrent_name?.toUpperCase()
                );
            }
            if (
              user.data.application.children_names[2].childscurrentmiddele_name
            ) {
              form
                .getTextField("form1[0].#subform[6].Pt4Line42c_MiddleName[0]")
                .setText(
                  user.data.application.children_names[2].childscurrentmiddele_name?.toUpperCase()
                );
            }
            if (
              user.data.application.children_names[2].childscurrentmiddele_name
            ) {
              form
                .getTextField("form1[0].#subform[6].Pt4Line43_Relationship[0]")
                .setText("CHILD");
            }

            if (
              user.data.application.children_names[2]
                .childscurrentdatefobirth_name
            ) {
              form
                .getTextField("form1[0].#subform[6].Pt4Line44_DateOfBirth[0]")
                .setText(
                  dateFormatter(
                    user.data.application.children_names[2]
                      .childscurrentdatefobirth_name
                  )
                );
            }

            if (
              user.data.application.children_names[2]
                .childscurrentcountryofbirth_name
            ) {
              form
                .getTextField(
                  "form1[0].#subform[6].Pt4Line45_CountryOfBirth[0]"
                )
                .setText(
                  user.data.application.children_names[2].childscurrentcountryofbirth_name?.toUpperCase()
                );
            }
          }

          if (user.data.application.children_names.length > 3) {
            if (
              user.data.application.children_names[3].childscurrentfamily_name
            ) {
              form
                .getTextField("form1[0].#subform[6].Pt4Line46a_FamilyName[0]")
                .setText(
                  user.data.application.children_names[3].childscurrentfamily_name?.toUpperCase()
                );
            }
            if (user.data.application.children_names[3].childscurrent_name) {
              form
                .getTextField("form1[0].#subform[6].Pt4Line46b_GivenName[0]")
                .setText(
                  user.data.application.children_names[3].childscurrent_name?.toUpperCase()
                );
            }
            if (
              user.data.application.children_names[3].childscurrentmiddele_name
            ) {
              form
                .getTextField("form1[0].#subform[6].Pt4Line46c_MiddleName[0]")
                .setText(
                  user.data.application.children_names[3].childscurrentmiddele_name?.toUpperCase()
                );
            }

            if (
              user.data.application.children_names[3].childscurrentmiddele_name
            ) {
              form
                .getTextField("form1[0].#subform[6].Pt4Line47_Relationship[0]")
                .setText("CHILD");
            }

            if (
              user.data.application.children_names[3]
                .childscurrentdatefobirth_name
            ) {
              form
                .getTextField("form1[0].#subform[6].Pt4Line48_DateOfBirth[0]")
                .setText(
                  dateFormatter(
                    user.data.application.children_names[3]
                      .childscurrentdatefobirth_name
                  )
                );
            }

            if (
              user.data.application.children_names[3]
                .childscurrentcountryofbirth_name
            ) {
              form
                .getTextField(
                  "form1[0].#subform[6].Pt4Line49_CountryOfBirth[1]"
                )
                .setText(
                  user.data.application.children_names[3].childscurrentcountryofbirth_name?.toUpperCase()
                );
            }
          }
        }

        // Employment

        if (Array.isArray(user.data.application.employerone_names)) {
          if (user.data.application.employerone_names.length) {
            // Name of employer or company

            if (user.data.application.employerone_names[0].employer_name) {
              form
                .getTextField("form1[0].#subform[6].Pt4Line26_NameOfCompany[0]")
                .setText(
                  user.data.application.employerone_names[0].employer_name
                    ?.toUpperCase()
                    ?.slice(0, 38)
                );
            }

            // Street number and name

            if (
              user.data.application.employerone_names[0].empmailingnumber_name
            ) {
              form
                .getTextField(
                  "form1[0].#subform[6].Pt4Line26_StreetNumberName[0]"
                )
                .setText(
                  user.data.application.employerone_names[0].empmailingnumber_name
                    ?.toUpperCase()
                    ?.slice(0, 34)
                );
            }

            // Apt./Ste./Flr. Number (if any)

            if (
              user.data.application.employerone_names[0].asfnumberus_name ==
              "Apt"
            ) {
              form
                .getCheckBox("form1[0].#subform[6].Pt4Line26_Unit[0]")
                .check();
            } else {
              form
                .getCheckBox("form1[0].#subform[6].Pt4Line26_Unit[0]")
                .uncheck();
            }

            if (
              user.data.application.employerone_names[0].asfnumberus_name ==
              "Ste"
            ) {
              form
                .getCheckBox("form1[0].#subform[6].Pt4Line26_Unit[1]")
                .check();
            } else {
              form
                .getCheckBox("form1[0].#subform[6].Pt4Line26_Unit[1]")
                .uncheck();
            }

            if (
              user.data.application.employerone_names[0].asfnumberus_name ==
              "Flr"
            ) {
              form
                .getCheckBox("form1[0].#subform[6].Pt4Line26_Unit[2]")
                .check();
            } else {
              form
                .getCheckBox("form1[0].#subform[6].Pt4Line26_Unit[2]")
                .uncheck();
            }

            if (user.data.application.employerone_names[0].ssste_name) {
              form
                .getTextField(
                  "form1[0].#subform[6].Pt4Line26_AptSteFlrNumber[0]"
                )
                .setText(
                  user.data.application.employerone_names[0].ssste_name?.toUpperCase()
                );
            }

            // City or town

            if (
              user.data.application.employerone_names[0]
                .previousfuturecityemployment_name
            ) {
              form
                .getTextField("form1[0].#subform[6].Pt4Line26_CityOrTown[0]")
                .setText(
                  user.data.application.employerone_names[0].previousfuturecityemployment_name?.toUpperCase()
                );
            }

            // State

            if (
              user.data.application.employerone_names[0]
                .previousfuturestateemployment_name
            ) {
              form
                .getDropdown("form1[0].#subform[6].Pt4Line26_State[0]")
                .select(
                  user.data.application.employerone_names[0]
                    .previousfuturestateemployment_name
                );
            }

            // Province

            if (
              user.data.application.employerone_names[0].employmentstate_name
            ) {
              form
                .getTextField("form1[0].#subform[6].Pt4Line26_Province[0]")
                .setText(
                  user.data.application.employerone_names[0].employmentstate_name?.toUpperCase()
                );
            }
            // ZIP Code

            if (user.data.application.employerone_names[0].employmentzip_name) {
              form
                .getTextField("form1[0].#subform[6].Pt4Line26_ZipCode[0]")
                .setText(
                  user.data.application.employerone_names[0].employmentzip_name?.toUpperCase()
                );
            }
            // Postal code

            if (
              user.data.application.employerone_names[0].employmentpostal_name
            ) {
              form
                .getTextField("form1[0].#subform[6].Pt4Line26_PostalCode[0]")
                .setText(
                  user.data.application.employerone_names[0].employmentpostal_name?.toUpperCase()
                );
            }

            // Country

            if (
              user.data.application.employerone_names[0].countryemployment_name
            ) {
              form
                .getTextField("form1[0].#subform[6].Pt4Line26_Country[0]")
                .setText(
                  user.data.application.employerone_names[0].countryemployment_name?.toUpperCase()
                );
            }

            if (user.data.application.employerone_names[0].employment_name) {
              form
                .getTextField(
                  "form1[0].#subform[6].Pt4Line27_DateEmploymentBegan[0]"
                )
                .setText(
                  dateFormatter(
                    user.data.application.employerone_names[0].employment_name
                  )
                );
            }
          }
        }

        let src = `${__dirname}/pdf_forms/i-130_done.pdf`;
        const pdfBytes = await pdfDoc.save();
        fs.writeFileSync(src, Buffer.from(pdfBytes));
        res.sendFile(src);
      }
    });
}

const pdfDownload130a = async (req, res) => {
  const existingPdfBytes = fs.readFileSync(`${__dirname}/pdf_forms/i-130a.pdf`);
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const form = pdfDoc.getForm();
  //temp
  const fields = form.getFields();
  fields.forEach((field) => {
    const name = field.getName();
    console.log(`${name} `);
  });

  //temp

  Data.findOne({
    _id: req.params.user_id,
  }).exec(async function (err, user) {
    if (user) {
      // Applicant info

      //Given name (first name)

      if (user.data.application.name) {
        form
          .getTextField("form1[0].#subform[0].Pt1Line3b_GivenName[0]")
          .setText(user.data.application.name?.toUpperCase());
      }

      // Middle name

      if (user.data.application.middle_name) {
        form
          .getTextField("form1[0].#subform[0].Pt1Line3c_MiddleName[0]")
          .setText(user.data.application.middle_name?.toUpperCase());
      }

      // Family name (last name)

      if (user.data.application.family_name) {
        form
          .getTextField("form1[0].#subform[0].Pt1Line3a_FamilyName[0]")
          .setText(user.data.application.family_name?.toUpperCase());
      }
      // Daytime phone number

      if (user.data.application.phonenumber_name) {
        form
          .getTextField(
            "form1[0].#subform[2].Pt4Line3_DaytimePhoneNumber1[0]"
          )
          .setText(user.data.application.phonenumber_name);
      }
      // Email address (if any)

      if (user.data.application.register_name) {
        form
          .getTextField("form1[0].#subform[2].Pt4Line5_Email[0]")
          .setText(user.data.application.register_name?.toUpperCase());
      }

      // Mobile phone number (if any)

      if (user.data.application.mobile_name) {
        form
          .getTextField("form1[0].#subform[2].Pt4Line4_MobileNumber1[0]")
          .setText(user.data.application.mobile_name);
      }

      // JERRY's Alien registration number (A-number) (if any)

      if (user.data.application.usregistrationnumber_name) {
        form
          .getTextField("form1[0].#subform[0].Pt1Line1_AlienNumber[0]")
          .setText(
            user.data.application.usregistrationnumber_name?.toUpperCase()
          );
      }

      if (user.data.application.appsignaturedate_name) {
        form
          .getTextField("form1[0].#subform[2].Pt4Line6b_DateofSignature[0]")
          .setText(
            dateFormatter(user.data.application.appsignaturedate_name)
          );
      }

      // JERRY's USCIS Online Account Number (if any)

      if (user.data.application.filedapetition_name) {
        form
          .getTextField(
            "form1[0].#subform[0].#area[0].USCISOnlineAcctNumber[0]"
          )
          .setText(user.data.application.filedapetition_name?.toUpperCase());
      }

      if (user.data.application.filedapetition_name) {
        form
          .getTextField(
            "form1[0].#subform[0].#area[1].Pt2Line3_USCISELISActNumber[0]"
          )
          .setText(user.data.application.filedapetition_name?.toUpperCase());
      }

      //Famaly

      // Mother

      // Given name (first name)

      if (user.data.application.mother_name) {
        form
          .getTextField("form1[0].#subform[1].Pt1Line10_GivenName[0]")
          .setText(user.data.application.mother_name?.toUpperCase());
      }

      // Middle name

      if (user.data.application.mother_middle_name) {
        form
          .getTextField("form1[0].#subform[1].Pt1Line10_MiddleName[0]")
          .setText(user.data.application.mother_middle_name?.toUpperCase());
      }

      // Family name (last name)

      if (user.data.application.mother_family_name) {
        form
          .getTextField("form1[0].#subform[1].Pt1Line10_FamilyName[0]")
          .setText(user.data.application.mother_family_name?.toUpperCase());
      }

      // Sex

      if (user.data.application.mother_family_name) {
        form.getCheckBox("form1[0].#subform[1].Pt1Line12_Female[0]").check();
      }

      // Date of birth

      // const gtgtgt = user.data.application.motherbirth_name;
      // if (Array.isArray(gtgtgt) && gtgtgt.length) {
      // 	const f = new Date(gtgtgt[0]);
      // 	if (isNaN(f) || !f) f = new Date();
      // 	let date_to_fillww = (f.getMonth() < 9 && '0' || '') + (f.getMonth() + 1) + '/';
      // 	date_to_fillww += (f.getDate() < 10 && '0' || '') + f.getDate() + '/' + f.getFullYear();
      // 	form.getTextField('form1[0].#subform[1].Pt1Line11_DateofBirth[0]').setText(date_to_fillww.toLocaleString());
      // }

      if (user.data.application.motherbirth_name) {
        form
          .getTextField("form1[0].#subform[1].Pt1Line11_DateofBirth[0]")
          .setText(dateFormatter(user.data.application.motherbirth_name));
      }

      if (user.data.application.motherCountry_name) {
        form
          .getTextField("form1[0].#subform[1].Pt1Line13_CountryofBirth[0]")
          .setText(user.data.application.motherCountry_name?.toUpperCase());
      }

      if (user.data.application.mothercity_name) {
        form
          .getTextField("form1[0].#subform[1].Pt1Line12CityTownOfBirth[0]")
          .setText(user.data.application.mothercity_name?.toUpperCase());
      }

      if (user.data.application.mothercurrentus_name) {
        form
          .getTextField(
            "form1[0].#subform[1].Pt1Line15_CountryofResidence[0]"
          )
          .setText(user.data.application.mothercurrentus_name?.toUpperCase());
      }

      if (user.data.application.motherresidence_name) {
        form
          .getTextField("form1[0].#subform[1].Pt1Line14_CountryofBirth[0]")
          .setText(user.data.application.motherresidence_name?.toUpperCase());
      }

      // Father

      // Given name (first name)

      if (user.data.application.father_name) {
        form
          .getTextField("form1[0].#subform[1].Pt1Line16_MiddleName[0]")
          .setText(user.data.application.father_name?.toUpperCase());
      }

      // Middle name

      if (user.data.application.motherresidence_name) {
        form
          .getTextField("form1[0].#subform[1].Pt1Line16_GivenName[0]")
          .setText(user.data.application.motherresidence_name?.toUpperCase());
      }

      // Family name (last name)

      if (user.data.application.father_family_name) {
        form
          .getTextField("form1[0].#subform[1].Pt1Line16_FamilyName[0]")
          .setText(user.data.application.father_family_name?.toUpperCase());
      }

      // Sex

      if (user.data.application.father_family_name) {
        form.getCheckBox("form1[0].#subform[1].Pt1Line19_Male[0]").check();
      }

      // Date of birth

      // const cvbcvb = user.data.application.fatherbirth_name;
      // if (Array.isArray(cvbcvb) && cvbcvb.length) {
      // 	const z = new Date(cvbcvb[0]);
      // 	if (isNaN(z) || !z) z = new Date();
      // 	let date_to_fillee = (z.getMonth() < 9 && '0' || '') + (z.getMonth() + 1) + '/';
      // 	date_to_fillee += (z.getDate() < 10 && '0' || '') + z.getDate() + '/' + z.getFullYear();
      // 	form.getTextField('form1[0].#subform[1].Pt1Line17_DateofBirth[0]').setText(date_to_fillee.toLocaleString());
      // }

      if (user.data.application.fatherbirth_name) {
        form
          .getTextField("form1[0].#subform[1].Pt1Line17_DateofBirth[0]")
          .setText(dateFormatter(user.data.application.fatherbirth_name));
      }

      if (user.data.application.fathercountry_name) {
        form
          .getTextField("form1[0].#subform[1].Pt1Line19_CountryofBirth[0]")
          .setText(user.data.application.fathercountry_name?.toUpperCase());
      }

      if (user.data.application.fathercity_name) {
        form
          .getTextField("form1[0].#subform[1].Pt1Line18_CityTownOfBirth[0]")
          .setText(user.data.application.fathercity_name?.toUpperCase());
      }

      if (user.data.application.usfathercurrent_name) {
        form
          .getTextField(
            "form1[0].#subform[1].Pt1Line21_CountryofResidence[0]"
          )
          .setText(user.data.application.usfathercurrent_name?.toUpperCase());
      }

      if (user.data.application.fatherresidence_name) {
        form
          .getTextField(
            "form1[0].#subform[1].Pt1Line20_CityTownVillageofRes[0]"
          )
          .setText(user.data.application.fatherresidence_name?.toUpperCase());
      }

      // Employment

      if (Array.isArray(user.data.application.employerone_names)) {
        if (user.data.application.employerone_names.length > 0) {
          // Name of employer or company

          if (user.data.application.employerone_names[0].employer_name) {
            form
              .getTextField(
                "form1[0].#subform[1].Pt2Line1_EmployerOrCompName[0]"
              )
              .setText(
                user.data.application.employerone_names[0].employer_name
              );
          }

          // Street number and name

          if (
            user.data.application.employerone_names[0].empmailingnumber_name
          ) {
            form
              .getTextField(
                "form1[0].#subform[1].Pt2Line2a_StreetNumberName[0]"
              )
              .setText(
                user.data.application.employerone_names[0].empmailingnumber_name?.toUpperCase()
              );
          }

          // Apt./Ste./Flr. Number (if any)

          if (
            user.data.application.employerone_names[0].asfnumberus_name ==
            "Apt"
          ) {
            form
              .getCheckBox("form1[0].#subform[1].Pt2Line2b_Unit[0]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[1].Pt2Line2b_Unit[0]")
              .uncheck();
          }

          if (
            user.data.application.employerone_names[0].asfnumberus_name ==
            "Ste"
          ) {
            form
              .getCheckBox("form1[0].#subform[1].Pt2Line2b_Unit[1]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[1].Pt2Line2b_Unit[1]")
              .uncheck();
          }

          if (
            user.data.application.employerone_names[0].asfnumberus_name ==
            "Flr"
          ) {
            form
              .getCheckBox("form1[0].#subform[1].Pt2Line2b_Unit[2]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[1].Pt2Line2b_Unit[2]")
              .uncheck();
          }

          if (user.data.application.employerone_names[0].ssste_name) {
            form
              .getTextField(
                "form1[0].#subform[1].Pt2Line2b_AptSteFlrNumber[0]"
              )
              .setText(user.data.application.employerone_names[0].ssste_name);
          }

          // City or town

          if (
            user.data.application.employerone_names[0]
              .previousfuturecityemployment_name
          ) {
            form
              .getTextField("form1[0].#subform[1].Pt2Line2c_CityOrTown[0]")
              .setText(
                user.data.application.employerone_names[0].previousfuturecityemployment_name?.toUpperCase()
              );
          }

          // Province

          if (
            user.data.application.employerone_names[0].employmentstate_name
          ) {
            form
              .getTextField("form1[0].#subform[1].Pt2Line2f_Province[0]")
              .setText(
                user.data.application.employerone_names[0].employmentstate_name?.toUpperCase()
              );
          }

          // ZIP Code

          if (user.data.application.employerone_names[0].employmentzip_name) {
            form
              .getTextField("form1[0].#subform[1].Pt2Line2e_ZipCode[0]")
              .setText(
                user.data.application.employerone_names[0].employmentzip_name?.toUpperCase()
              );
          }

          // Postal code

          if (
            user.data.application.employerone_names[0].employmentpostal_name
          ) {
            form
              .getTextField("form1[0].#subform[1].Pt2Line2g_PostalCode[0]")
              .setText(
                user.data.application.employerone_names[0].employmentpostal_name?.toUpperCase()
              );
          }

          // Country

          if (
            user.data.application.employerone_names[0].countryemployment_name
          ) {
            form
              .getTextField("form1[0].#subform[1].Pt2Line2h_Country[0]")
              .setText(
                user.data.application.employerone_names[0].countryemployment_name?.toUpperCase()
              );
          }

          // State

          if (
            user.data.application.employerone_names[0]
              .previousfuturestateemployment_name
          ) {
            form
              .getDropdown("form1[0].#subform[1].Pt2Line2d_State[0]")
              .select(
                user.data.application.employerone_names[0]
                  .previousfuturestateemployment_name
              );
          }

          // jerry's Occupation

          if (user.data.application.employerone_names[0].occupationus_name) {
            form
              .getTextField("form1[0].#subform[1].Pt2Line3_Occupation[0]")
              .setText(
                user.data.application.employerone_names[0].occupationus_name?.toUpperCase()
              );
          }

          // Employment start date

          // const dfggfdq = user.data.application.employerone_names[0].employment_name;
          // if (Array.isArray(dfggfdq) && dfggfdq.length) {
          // 	const l = new Date(dfggfdq[0]);
          // 	if (isNaN(l) || !l) l = new Date();
          // 	let date_to_fillrr = (l.getMonth() < 9 && '0' || '') + (l.getMonth() + 1) + '/';
          // 	date_to_fillrr += (l.getDate() < 10 && '0' || '') + l.getDate() + '/' + l.getFullYear();
          // 	form.getTextField('form1[0].#subform[1].Pt2Line4a_DateFrom[0]').setText(date_to_fillrr.toLocaleString());
          // }

          if (user.data.application.employerone_names[0].employment_name) {
            form
              .getTextField("form1[0].#subform[1].Pt2Line4a_DateFrom[0]")
              .setText(
                dateFormatter(
                  user.data.application.employerone_names[0].employment_name
                )
              );
          }

          // Employment end date

          // const ujujuj = user.data.application.employerone_names[0].currentemployment_name;
          // if (Array.isArray(ujujuj) && ujujuj.length) {
          // 	const h = new Date(ujujuj[0]);
          // 	if (isNaN(h) || !h) h = new Date();
          // 	let date_to_filltt = (h.getMonth() < 9 && '0' || '') + (h.getMonth() + 1) + '/';
          // 	date_to_filltt += (h.getDate() < 10 && '0' || '') + h.getDate() + '/' + h.getFullYear();
          // 	form.getTextField('form1[0].#subform[1].Pt2Line4b_DateTo[0]').setText(date_to_filltt.toLocaleString());
          // }

          // if (
          //   user.data.application.employerone_names[0].currentemployment_name
          // ) {
          //   form
          //     .getTextField("form1[0].#subform[1].Pt2Line4b_DateTo[0]")
          //     .setText(
          //       dateFormatter(
          //         user.data.application.employerone_names[0]
          //           .currentemployment_name
          //       )
          //     );
          // }

          // Employment 2

          if (user.data.application.employerone_names.length > 1) {
            // Name of employer or company

            if (user.data.application.employerone_names[1].employer_name) {
              form
                .getTextField(
                  "form1[0].#subform[1].Pt2Line5_EmployerOrCompName[0]"
                )
                .setText(
                  user.data.application.employerone_names[1].employer_name?.toUpperCase()
                );
            }

            // Street number and name

            if (
              user.data.application.employerone_names[1].empmailingnumber_name
            ) {
              form
                .getTextField(
                  "form1[0].#subform[1].Pt2Line6_StreetNumberName[0]"
                )
                .setText(
                  user.data.application.employerone_names[1].empmailingnumber_name
                    ?.toUpperCase()
                    ?.slice(0, 34)
                );
            }

            // Apt./Ste./Flr. Number (if any)

            if (
              user.data.application.employerone_names[1].asfnumberus_name ==
              "Apt"
            ) {
              form
                .getCheckBox("form1[0].#subform[1].Pt2Line6_Unit[0]")
                .check();
            } else {
              form
                .getCheckBox("form1[0].#subform[1].Pt2Line6_Unit[0]")
                .uncheck();
            }

            if (
              user.data.application.employerone_names[1].asfnumberus_name ==
              "Ste"
            ) {
              form
                .getCheckBox("form1[0].#subform[1].Pt2Line6_Unit[1]")
                .check();
            } else {
              form
                .getCheckBox("form1[0].#subform[1].Pt2Line6_Unit[1]")
                .uncheck();
            }

            if (
              user.data.application.employerone_names[1].asfnumberus_name ==
              "Flr"
            ) {
              form
                .getCheckBox("form1[0].#subform[1].Pt2Line6_Unit[2]")
                .check();
            } else {
              form
                .getCheckBox("form1[0].#subform[1].Pt2Line6_Unit[2]")
                .uncheck();
            }
            if (user.data.application.employerone_names[1].ssste_name) {
              form
                .getTextField(
                  "form1[0].#subform[1].Pt2Line6_AptSteFlrNumber[0]"
                )
                .setText(
                  user.data.application.employerone_names[1].ssste_name
                );
            }

            // City or town

            if (
              user.data.application.employerone_names[1]
                .previousfuturecityemployment_name
            ) {
              form
                .getTextField("form1[0].#subform[1].Pt2Line6_CityOrTown[0]")
                .setText(
                  user.data.application.employerone_names[1].previousfuturecityemployment_name?.toUpperCase()
                );
            }

            // Province

            if (
              user.data.application.employerone_names[1].employmentstate_name
            ) {
              form
                .getTextField("form1[0].#subform[1].Pt2Line6_Province[0]")
                .setText(
                  user.data.application.employerone_names[1].employmentstate_name?.toUpperCase()
                );
            }

            // ZIP Code

            if (
              user.data.application.employerone_names[1].employmentzip_name
            ) {
              form
                .getTextField("form1[0].#subform[1].Pt2Line6_ZipCode[0]")
                .setText(
                  user.data.application.employerone_names[1].employmentzip_name?.toUpperCase()
                );
            }

            // Postal code

            if (
              user.data.application.employerone_names[1].employmentpostal_name
            ) {
              form
                .getTextField("form1[0].#subform[1].Pt2Line6_PostalCode[0]")
                .setText(
                  user.data.application.employerone_names[1].employmentpostal_name?.toUpperCase()
                );
            }

            // Country

            if (
              user.data.application.employerone_names[1]
                .countryemployment_name
            ) {
              form
                .getTextField("form1[0].#subform[1].Pt2Line6_Country[0]")
                .setText(
                  user.data.application.employerone_names[1].countryemployment_name?.toUpperCase()
                );
            }

            // State

            if (
              user.data.application.employerone_names[1]
                .previousfuturestateemployment_name
            ) {
              form
                .getDropdown("form1[0].#subform[1].Pt2Line6_State[0]")
                .select(
                  user.data.application.employerone_names[1].previousfuturestateemployment_name?.toUpperCase()
                );
            }

            // jerry's Occupation

            if (
              user.data.application.employerone_names[1].occupationus_name
            ) {
              form
                .getTextField("form1[0].#subform[2].Pt2Line7_Occupation[0]")
                .setText(
                  user.data.application.employerone_names[1].occupationus_name?.toUpperCase()
                );
            }

            // Employment start date

            // const llsfsdfsdf = user.data.application.employerone_names[1].employment_name;
            // if (Array.isArray(llsfsdfsdf) && llsfsdfsdf.length) {
            // 	const ll = new Date(llsfsdfsdf[0]);
            // 	if (isNaN(ll) || !ll) ll = new Date();
            // 	let date_to_fillyy = (ll.getMonth() < 9 && '0' || '') + (ll.getMonth() + 1) + '/';
            // 	date_to_fillyy += (ll.getDate() < 10 && '0' || '') + ll.getDate() + '/' + ll.getFullYear();
            // 	form.getTextField('form1[0].#subform[2].Pt2Line8a_DateFrom[0]').setText(date_to_fillyy.toLocaleString());
            // }

            if (user.data.application.employerone_names[1].employment_name) {
              form
                .getTextField("form1[0].#subform[2].Pt2Line8a_DateFrom[0]")
                .setText(
                  dateFormatter(
                    user.data.application.employerone_names[1].employment_name
                  )
                );
            }

            //Employment end date

            // const hhfghfgh = user.data.application.employerone_names[1].currentemployment_name;
            // if (Array.isArray(hhfghfgh) && hhfghfgh.length) {
            // 	const hh = new Date(hhfghfgh[0]);
            // 	if (isNaN(hh) || !hh) hh = new Date();
            // 	let date_to_filluu = (hh.getMonth() < 9 && '0' || '') + (hh.getMonth() + 1) + '/';
            // 	date_to_filluu += (hh.getDate() < 10 && '0' || '') + hh.getDate() + '/' + hh.getFullYear();
            // 	form.getTextField('form1[0].#subform[2].Pt2Line8b_DateTo[0]').setText(date_to_filluu.toLocaleString());
            // }

            if (
              user.data.application.employerone_names[1]
                .currentemployment_name
            ) {
              form
                .getTextField("form1[0].#subform[2].Pt2Line8b_DateTo[0]")
                .setText(
                  dateFormatter(
                    user.data.application.employerone_names[1]
                      .currentemployment_name
                  )
                );
            }
          }
        }
      }

      //Language

      if (user.data.application.name) {
        form.getCheckBox("form1[0].#subform[2].Pt4Line1Checkbox[1]").check();
      }
      // LAST EMPLOYMENT ABROAD

      // Name of employer or company

      if (user.data.application.employerorcompanyus_name) {
        form
          .getTextField("form1[0].#subform[2].Pt3Line1_EmployerOrCompName[0]")
          .setText(
            user.data.application.employerorcompanyus_name?.toUpperCase()
          );
      }

      // Street number and name

      if (user.data.application.usstreetcompany_name) {
        form
          .getTextField("form1[0].#subform[2].Pt3Line2a_StreetNumberName[0]")
          .setText(user.data.application.usstreetcompany_name?.toUpperCase());
      }

      // Apt./Ste./Flr. Number (if any)

      if (user.data.application.asfnumberus_name == "Apt") {
        form.getCheckBox("form1[0].#subform[2].Pt3Line2b_Unit[0]").check();
      } else {
        form.getCheckBox("form1[0].#subform[2].Pt3Line2b_Unit[0]").uncheck();
      }

      if (user.data.application.asfnumberus_name == "Ste") {
        form.getCheckBox("form1[0].#subform[2].Pt3Line2b_Unit[1]").check();
      } else {
        form.getCheckBox("form1[0].#subform[2].Pt3Line2b_Unit[1]").uncheck();
      }

      if (user.data.application.asfnumberus_name == "Flr") {
        form.getCheckBox("form1[0].#subform[2].Pt3Line2b_Unit[2]").check();
      } else {
        form.getCheckBox("form1[0].#subform[2].Pt3Line2b_Unit[2]").uncheck();
      }

      form
        .getTextField("form1[0].#subform[2].Pt3Line2b_AptSteFlrNumber[0]")
        .setText(user.data.application.ste_name);

      // City or town

      if (user.data.application.townus_name) {
        form
          .getTextField("form1[0].#subform[2].Pt3Line2c_CityOrTown[0]")
          .setText(user.data.application.townus_name?.toUpperCase());
      }

      // Province

      if (user.data.application.usprovince_name) {
        form
          .getTextField("form1[0].#subform[2].Pt3Line2f_Province[0]")
          .setText(user.data.application.usprovince_name?.toUpperCase());
      }

      // Postal code

      if (user.data.application.postalcodeus_name) {
        form
          .getTextField("form1[0].#subform[2].Pt3Line2g_PostalCode[0]")
          .setText(user.data.application.postalcodeus_name?.toUpperCase());
      }

      // Country

      if (user.data.application.cccountry_name) {
        form
          .getTextField("form1[0].#subform[2].Pt3Line2h_Country[0]")
          .setText(user.data.application.cccountry_name?.toUpperCase());
      }

      // jerry's Occupation

      if (user.data.application.occupationus_name) {
        form
          .getTextField("form1[0].#subform[2].Pt3Line3_Occupation[0]")
          .setText(user.data.application.occupationus_name?.toUpperCase());
      }

      // Employment start date

      // const dwhjkjhk = user.data.application.startemploymentus_name;
      // if (Array.isArray(dwhjkjhk) && dwhjkjhk.length) {
      // 	const dw = new Date(dwhjkjhk[0]);
      // 	if (isNaN(dw) || !dw) dw = new Date();
      // 	let date_to_fillii = (dw.getMonth() < 9 && '0' || '') + (dw.getMonth() + 1) + '/';
      // 	date_to_fillii += (dw.getDate() < 10 && '0' || '') + dw.getDate() + '/' + dw.getFullYear();
      // 	form.getTextField('form1[0].#subform[2].Pt3Line4a_DateFrom[0]').setText(date_to_fillii.toLocaleString());
      // }

      if (user.data.application.startemploymentus_name) {
        form
          .getTextField("form1[0].#subform[2].Pt3Line4a_DateFrom[0]")
          .setText(
            dateFormatter(user.data.application.startemploymentus_name)
          );
      }

      // Employment end date

      // const dqtyutyu = user.data.application.endemploymentus_name;
      // if (Array.isArray(dqtyutyu) && dqtyutyu.length) {
      // 	const dq = new Date(dqtyutyu[0]);
      // 	if (isNaN(dq) || !dq) dq = new Date();
      // 	let date_to_filloo = (dq.getMonth() < 9 && '0' || '') + (dq.getMonth() + 1) + '/';
      // 	date_to_filloo += (dq.getDate() < 10 && '0' || '') + dq.getDate() + '/' + dq.getFullYear();
      // 	form.getTextField('form1[0].#subform[2].Pt3Line4b_DateTo[0]').setText(date_to_filloo.toLocaleString());
      // }

      // if (user.data.application.endemploymentus_name) {
      //   form
      //     .getTextField("form1[0].#subform[2].Pt3Line4b_DateTo[0]")
      //     .setText(dateFormatter(user.data.application.endemploymentus_name));
      // }

      // Places lived

      if (user.data.application.mailingaddressus_name === "no") {
        if (user.data.application.insideusnumber_name) {
          form
            .getTextField(
              "form1[0].#subform[0].Pt1Line4a_StreetNumberName[0]"
            )
            .setText(
              user.data.application.insideusnumber_name?.toUpperCase()
            );
        }

        if (user.data.application.insideusifany_name == "Flr") {
          form.getCheckBox("form1[0].#subform[0].Pt1Line4b_Unit[0]").check();
        } else {
          form
            .getCheckBox("form1[0].#subform[0].Pt1Line4b_Unit[0]")
            .uncheck();
        }

        if (user.data.application.insideusifany_name == "Ste") {
          form.getCheckBox("form1[0].#subform[0].Pt1Line4b_Unit[1]").check();
        } else {
          form
            .getCheckBox("form1[0].#subform[0].Pt1Line4b_Unit[1]")
            .uncheck();
        }

        if (user.data.application.insideusifany_name == "Apt") {
          form.getCheckBox("form1[0].#subform[0].Pt1Line4b_Unit[2]").check();
        } else {
          form
            .getCheckBox("form1[0].#subform[0].Pt1Line4b_Unit[2]")
            .uncheck();
        }

        // Apt./Ste./Flr. Number (if any)

        if (user.data.application.usifany_name) {
          form
            .getTextField("form1[0].#subform[0].Pt1Line4b_AptSteFlrNumber[0]")
            .setText(user.data.application.usifany_name?.toUpperCase());
        }

        // City or town

        if (user.data.application.insideusgcity_name) {
          form
            .getTextField("form1[0].#subform[0].Pt1Line4c_CityOrTown[0]")
            .setText(user.data.application.insideusgcity_name);
        }

        // State

        if (user.data.application.insideusstate_name) {
          form
            .getDropdown("form1[0].#subform[0].Pt1Line4d_State[0]")
            .select(user.data.application.insideusstate_name);
        }

        if (user.data.application.insideuscode_name) {
          form
            .getTextField("form1[0].#subform[0].Pt1Line4e_ZipCode[0]")
            .setText(user.data.application.insideuscode_name);
        }
        if (user.data.application.insideusaddress_name) {
          form
            .getTextField("form1[0].#subform[0].Pt1Line4h_Country[0]")
            .setText(user.data.application.insideusaddress_name);
        }

        if (user.data.application.insideusdate_name) {
          form
            .getTextField("form1[0].#subform[0].Pt1Line5a_DateFrom[0]")
            .setText(dateFormatter(user.data.application.insideusdate_name));
        }
      }

      if (user.data.application.mailingaddressus_name === "yes") {
        if (user.data.application.mailingnumber_name) {
          form
            .getTextField(
              "form1[0].#subform[0].Pt1Line4a_StreetNumberName[0]"
            )
            .setText(user.data.application.mailingnumber_name?.toUpperCase());
        }

        if (user.data.application.apt_name == "Flr") {
          form.getCheckBox("form1[0].#subform[0].Pt1Line4b_Unit[0]").check();
        } else {
          form
            .getCheckBox("form1[0].#subform[0].Pt1Line4b_Unit[0]")
            .uncheck();
        }

        if (user.data.application.apt_name == "Ste") {
          form.getCheckBox("form1[0].#subform[0].Pt1Line4b_Unit[1]").check();
        } else {
          form
            .getCheckBox("form1[0].#subform[0].Pt1Line4b_Unit[1]")
            .uncheck();
        }

        if (user.data.application.apt_name == "Apt") {
          form.getCheckBox("form1[0].#subform[0].Pt1Line4b_Unit[2]").check();
        } else {
          form
            .getCheckBox("form1[0].#subform[0].Pt1Line4b_Unit[2]")
            .uncheck();
        }

        // Apt./Ste./Flr. Number (if any)

        if (user.data.application.ste_name) {
          form
            .getTextField("form1[0].#subform[0].Pt1Line4b_AptSteFlrNumber[0]")
            .setText(user.data.application.ste_name?.toUpperCase());
        }

        // City or town

        if (user.data.application.mailingcity_name) {
          form
            .getTextField("form1[0].#subform[0].Pt1Line4c_CityOrTown[0]")
            .setText(user.data.application.mailingcity_name);
        }

        // State

        if (user.data.application.insidemailingprovince_name) {
          form
            .getDropdown("form1[0].#subform[0].Pt1Line4d_State[0]")
            .select(user.data.application.insidemailingprovince_name);
        }

        if (user.data.application.mailingpostalcode_name) {
          form
            .getTextField("form1[0].#subform[0].Pt1Line4e_ZipCode[0]")
            .setText(user.data.application.mailingpostalcode_name);
        }
        if (user.data.application.mailingnumber_name) {
          form
            .getTextField("form1[0].#subform[0].Pt1Line4h_Country[0]")
            .setText("USA");
        }
      }

      if (user.data.application.name) {
        form
          .getTextField("form1[0].#subform[5].Pt1Line3b_GivenName[1]")
          .setText(user.data.application.name);
      }

      if (user.data.application.middle_name) {
        form
          .getTextField("form1[0].#subform[5].Pt1Line3c_MiddleName[1]")
          .setText(user.data.application.middle_name);
      }

      if (user.data.application.family_name) {
        form
          .getTextField("form1[0].#subform[5].Pt1Line3a_FamilyName[1]")
          .setText(user.data.application.family_name);
      }

      if (user.data.application.usregistrationnumber_name) {
        form
          .getTextField("form1[0].#subform[5].Pt1Line1_AlienNumber[1]")
          .setText(user.data.application.usregistrationnumber_name);
      }

      if (user.data.application.name) {
        form
          .getTextField("form1[0].#subform[5].Pt7Line3a_PageNumber[0]")
          .setText("1");
      }

      if (user.data.application.name) {
        form
          .getTextField("form1[0].#subform[5].Pt7Line3b_PartNumber[0]")
          .setText("1");
      }

      if (user.data.application.name) {
        form
          .getTextField("form1[0].#subform[5].Pt7Line3c_ItemNumber[0]")
          .setText("4");
      }

      if (user.data.application.name) {
        form
          .getTextField("form1[0].#subform[5].Pt7Line5a_PageNumber[0]")
          .setText("2");
      }

      if (user.data.application.name) {
        form
          .getTextField("form1[0].#subform[5].Pt7Line5b_PartNumber[0]")
          .setText("2");
      }

      if (user.data.application.name) {
        form
          .getTextField("form1[0].#subform[5].Pt7Line5c_ItemNumber[0]")
          .setText("1");
      }

      if (user.data.application.name) {
        form
          .getTextField("form1[0].#subform[5].Pt7Line6a_PageNumber[0]")
          .setText("2");
      }

      if (user.data.application.name) {
        form
          .getTextField("form1[0].#subform[5].Pt7Line6b_PartNumber[0]")
          .setText("2");
      }

      if (user.data.application.name) {
        form
          .getTextField("form1[0].#subform[5].Pt7Line6c_ItemNumber[0]")
          .setText("1");
      }

      if (user.data.application.name) {
        form
          .getTextField("form1[0].#subform[5].Pt7Line4a_PageNumber[0]")
          .setText("1");
      }

      if (user.data.application.name) {
        form
          .getTextField("form1[0].#subform[5].Pt7Line4b_PartNumber[0]")
          .setText("1");
      }

      if (user.data.application.name) {
        form
          .getTextField("form1[0].#subform[5].Pt7Line4c_ItemNumber[0]")
          .setText("4");
      }

      if (user.data.application.typeofaddress_names.length) {
        let rs = "";

        if (user.data.application.typeofaddress_names[2]?.usplaces_name)
          // res.push(user.data.application.typeofaddress_names[2].usplaces_name)
          rs += `${user.data.application.typeofaddress_names[2].usplaces_name}, `;

        if (user.data.application.typeofaddress_names[2]?.numberaptste_name)
          // res.push(user.data.application.typeofaddress_names[2].numberaptste_name)
          rs += `${user.data.application.typeofaddress_names[2].numberaptste_name} `;

        if (user.data.application.typeofaddress_names[2]?.stedf_name)
          // res.push(user.data.application.typeofaddress_names[2].stedf_name)
          rs += `${user.data.application.typeofaddress_names[2].stedf_name}, `;

        if (
          user.data.application.typeofaddress_names[2]
            ?.previousfuturecityq_name
        )
          // res.push(user.data.application.typeofaddress_names[2].previousfuturecityq_name)
          rs += `${user.data.application.typeofaddress_names[2].previousfuturecityq_name}, `;

        if (
          user.data.application.typeofaddress_names[2]
            ?.prweviousfuturestate_name
        )
          // res.push(user.data.application.typeofaddress_names[2].prweviousfuturestate_name)
          rs += `${user.data.application.typeofaddress_names[2].prweviousfuturestate_name}, `;

        if (
          user.data.application.typeofaddress_names[2]
            ?.previousfuturewzyzip_name
        )
          // res.push(user.data.application.typeofaddress_names[2].previousfuturewzyzip_name)
          rs += `${user.data.application.typeofaddress_names[2].previousfuturewzyzip_name}, `;

        if (
          user.data.application.typeofaddress_names[2]?.futurfuturestate_name
        )
          // res.push(user.data.application.typeofaddress_names[2].futurfuturestate_name)
          rs += `${user.data.application.typeofaddress_names[2].futurfuturestate_name}, `;

        if (
          user.data.application.typeofaddress_names[2]
            ?.futurepreviousfutu_name
        )
          // res.push(user.data.application.typeofaddress_names[2].futurepreviousfutu_name)
          rs += `${user.data.application.typeofaddress_names[2].futurepreviousfutu_name}, `;

        if (
          user.data.application.typeofaddress_names[2]
            ?.previousaddress_name === "USA"
        )
          // res.push(user.data.application.typeofaddress_names[2].previousaddress_name)
          rs += `${user.data.application.typeofaddress_names[2].previousaddress_name}, `;
        else if (
          user.data.application.typeofaddress_names[2]
            ?.previousaddress_name !== "USA" &&
          user.data.application.typeofaddress_names[2]?.previousaddress_name
        )
          // res.push(user.data.application.typeofaddress_names[2]?.countphysical_name)
          rs += `${user.data.application.typeofaddress_names[2]?.recenstcountryfuture_name}, `;

        if (user.data.application.typeofaddress_names[2]?.previousmovein_name)
          // res.push(dateFormatter(user.data.application.typeofaddress_names[2].previousmovein_name))
          rs += `${dateFormatter(
            user.data.application.typeofaddress_names[2].previousmovein_name
          )} TO `;

        if (
          user.data.application.typeofaddress_names[2]?.previousmoveout_name
        )
          // res.push(dateFormatter(user.data.application.typeofaddress_names[2].previousmoveout_name))
          rs += `${dateFormatter(
            user.data.application.typeofaddress_names[2].previousmoveout_name
          )} \n`;

        if (user.data.application.typeofaddress_names[3]?.usplaces_name)
          // res.push(user.data.application.typeofaddress_names[3].usplaces_name)
          rs += `${user.data.application.typeofaddress_names[3].usplaces_name}, `;

        if (user.data.application.typeofaddress_names[3]?.numberaptste_name)
          // res.push(user.data.application.typeofaddress_names[3].numberaptste_name)
          rs += `${user.data.application.typeofaddress_names[3].numberaptste_name} `;

        if (user.data.application.typeofaddress_names[3]?.stedf_name)
          // res.push(user.data.application.typeofaddress_names[3].stedf_name)
          rs += `${user.data.application.typeofaddress_names[3].stedf_name}, `;

        if (
          user.data.application.typeofaddress_names[3]
            ?.previousfuturecityq_name
        )
          // res.push(user.data.application.typeofaddress_names[3].previousfuturecityq_name)
          rs += `${user.data.application.typeofaddress_names[3].previousfuturecityq_name}, `;

        if (
          user.data.application.typeofaddress_names[3]
            ?.prweviousfuturestate_name
        )
          // res.push(user.data.application.typeofaddress_names[3].prweviousfuturestate_name)
          rs += `${user.data.application.typeofaddress_names[3].prweviousfuturestate_name}, `;

        if (
          user.data.application.typeofaddress_names[3]
            ?.previousfuturewzyzip_name
        )
          // res.push(user.data.application.typeofaddress_names[3].previousfuturewzyzip_name)
          rs += `${user.data.application.typeofaddress_names[3].previousfuturewzyzip_name}, `;

        if (
          user.data.application.typeofaddress_names[3]?.futurfuturestate_name
        )
          // res.push(user.data.application.typeofaddress_names[3].futurfuturestate_name)
          rs += `${user.data.application.typeofaddress_names[3].futurfuturestate_name}, `;

        if (
          user.data.application.typeofaddress_names[3]
            ?.futurepreviousfutu_name
        )
          // res.push(user.data.application.typeofaddress_names[3].futurepreviousfutu_name)
          rs += `${user.data.application.typeofaddress_names[3].futurepreviousfutu_name}, `;

        if (
          user.data.application.typeofaddress_names[3]
            ?.previousaddress_name === "USA"
        )
          // res.push(user.data.application.typeofaddress_names[3].previousaddress_name)
          rs += `${user.data.application.typeofaddress_names[3].previousaddress_name}, `;
        else if (
          user.data.application.typeofaddress_names[3]
            ?.previousaddress_name !== "USA" &&
          user.data.application.typeofaddress_names[3]?.previousaddress_name
        )
          // res.push(user.data.application.typeofaddress_names[3]?.countphysical_name)
          rs += `${user.data.application.typeofaddress_names[3]?.recenstcountryfuture_name}, `;

        if (user.data.application.typeofaddress_names[3]?.previousmovein_name)
          // res.push(dateFormatter(user.data.application.typeofaddress_names[3].previousmovein_name))
          rs += `${dateFormatter(
            user.data.application.typeofaddress_names[3].previousmovein_name
          )} TO `;

        if (
          user.data.application.typeofaddress_names[3]?.previousmoveout_name
        )
          // res.push(dateFormatter(user.data.application.typeofaddress_names[3].previousmoveout_name))
          rs += `${dateFormatter(
            user.data.application.typeofaddress_names[3].previousmoveout_name
          )} \n`;

        form
          .getTextField("form1[0].#subform[5].Pt7Line3d_AdditionalInfo[0]")
          .setText(rs?.toUpperCase());
      }

      if (user.data.application.typeofaddress_names.length) {
        let rs = "";

        if (user.data.application.typeofaddress_names[4]?.usplaces_name)
          // res.push(user.data.application.typeofaddress_names[4].usplaces_name)
          rs += `${user.data.application.typeofaddress_names[4].usplaces_name}, `;

        if (user.data.application.typeofaddress_names[4]?.numberaptste_name)
          // res.push(user.data.application.typeofaddress_names[4].numberaptste_name)
          rs += `${user.data.application.typeofaddress_names[4].numberaptste_name} `;

        if (user.data.application.typeofaddress_names[4]?.stedf_name)
          // res.push(user.data.application.typeofaddress_names[4].stedf_name)
          rs += `${user.data.application.typeofaddress_names[4].stedf_name}, `;

        if (
          user.data.application.typeofaddress_names[4]
            ?.previousfuturecityq_name
        )
          // res.push(user.data.application.typeofaddress_names[4].previousfuturecityq_name)
          rs += `${user.data.application.typeofaddress_names[4].previousfuturecityq_name}, `;

        if (
          user.data.application.typeofaddress_names[4]
            ?.prweviousfuturestate_name
        )
          // res.push(user.data.application.typeofaddress_names[4].prweviousfuturestate_name)
          rs += `${user.data.application.typeofaddress_names[4].prweviousfuturestate_name}, `;

        if (
          user.data.application.typeofaddress_names[4]
            ?.previousfuturewzyzip_name
        )
          // res.push(user.data.application.typeofaddress_names[4].previousfuturewzyzip_name)
          rs += `${user.data.application.typeofaddress_names[4].previousfuturewzyzip_name}, `;

        if (
          user.data.application.typeofaddress_names[4]?.futurfuturestate_name
        )
          // res.push(user.data.application.typeofaddress_names[4].futurfuturestate_name)
          rs += `${user.data.application.typeofaddress_names[4].futurfuturestate_name}, `;

        if (
          user.data.application.typeofaddress_names[4]
            ?.futurepreviousfutu_name
        )
          // res.push(user.data.application.typeofaddress_names[4].futurepreviousfutu_name)
          rs += `${user.data.application.typeofaddress_names[4].futurepreviousfutu_name}, `;

        if (
          user.data.application.typeofaddress_names[4]
            ?.previousaddress_name === "USA"
        )
          // res.push(user.data.application.typeofaddress_names[4].previousaddress_name)
          rs += `${user.data.application.typeofaddress_names[4].previousaddress_name}, `;
        else if (
          user.data.application.typeofaddress_names[4]
            ?.previousaddress_name !== "USA" &&
          user.data.application.typeofaddress_names[4]?.previousaddress_name
        )
          // res.push(user.data.application.typeofaddress_names[4]?.countphysical_name)
          rs += `${user.data.application.typeofaddress_names[4]?.recenstcountryfuture_name}, `;

        if (user.data.application.typeofaddress_names[4]?.previousmovein_name)
          // res.push(dateFormatter(user.data.application.typeofaddress_names[4].previousmovein_name))
          rs += `${dateFormatter(
            user.data.application.typeofaddress_names[4].previousmovein_name
          )} TO `;

        if (
          user.data.application.typeofaddress_names[4]?.previousmoveout_name
        )
          // res.push(dateFormatter(user.data.application.typeofaddress_names[4].previousmoveout_name))
          rs += `${dateFormatter(
            user.data.application.typeofaddress_names[4].previousmoveout_name
          )} \n`;

        if (user.data.application.typeofaddress_names[5]?.usplaces_name)
          // res.push(user.data.application.typeofaddress_names[5].usplaces_name)
          rs += `${user.data.application.typeofaddress_names[5].usplaces_name}, `;

        if (user.data.application.typeofaddress_names[5]?.numberaptste_name)
          // res.push(user.data.application.typeofaddress_names[5].numberaptste_name)
          rs += `${user.data.application.typeofaddress_names[5].numberaptste_name} `;

        if (user.data.application.typeofaddress_names[5]?.stedf_name)
          // res.push(user.data.application.typeofaddress_names[5].stedf_name)
          rs += `${user.data.application.typeofaddress_names[5].stedf_name}, `;

        if (
          user.data.application.typeofaddress_names[5]
            ?.previousfuturecityq_name
        )
          // res.push(user.data.application.typeofaddress_names[5].previousfuturecityq_name)
          rs += `${user.data.application.typeofaddress_names[5].previousfuturecityq_name}, `;

        if (
          user.data.application.typeofaddress_names[5]
            ?.prweviousfuturestate_name
        )
          // res.push(user.data.application.typeofaddress_names[5].prweviousfuturestate_name)
          rs += `${user.data.application.typeofaddress_names[5].prweviousfuturestate_name}, `;

        if (
          user.data.application.typeofaddress_names[5]
            ?.previousfuturewzyzip_name
        )
          // res.push(user.data.application.typeofaddress_names[5].previousfuturewzyzip_name)
          rs += `${user.data.application.typeofaddress_names[5].previousfuturewzyzip_name}, `;

        if (
          user.data.application.typeofaddress_names[5]?.futurfuturestate_name
        )
          // res.push(user.data.application.typeofaddress_names[5].futurfuturestate_name)
          rs += `${user.data.application.typeofaddress_names[5].futurfuturestate_name}, `;

        if (
          user.data.application.typeofaddress_names[5]
            ?.futurepreviousfutu_name
        )
          // res.push(user.data.application.typeofaddress_names[5].futurepreviousfutu_name)
          rs += `${user.data.application.typeofaddress_names[5].futurepreviousfutu_name}, `;

        if (
          user.data.application.typeofaddress_names[5]
            ?.previousaddress_name === "USA"
        )
          // res.push(user.data.application.typeofaddress_names[5].previousaddress_name)
          rs += `${user.data.application.typeofaddress_names[5].previousaddress_name}, `;
        else if (
          user.data.application.typeofaddress_names[5]
            ?.previousaddress_name !== "USA" &&
          user.data.application.typeofaddress_names[5]?.previousaddress_name
        )
          // res.push(user.data.application.typeofaddress_names[5]?.countphysical_name)
          rs += `${user.data.application.typeofaddress_names[5]?.recenstcountryfuture_name}, `;

        if (user.data.application.typeofaddress_names[5]?.previousmovein_name)
          // res.push(dateFormatter(user.data.application.typeofaddress_names[5].previousmovein_name))
          rs += `${dateFormatter(
            user.data.application.typeofaddress_names[5].previousmovein_name
          )} TO `;

        if (
          user.data.application.typeofaddress_names[5]?.previousmoveout_name
        )
          // res.push(dateFormatter(user.data.application.typeofaddress_names[5].previousmoveout_name))
          rs += `${dateFormatter(
            user.data.application.typeofaddress_names[5].previousmoveout_name
          )} \n`;

        form
          .getTextField("form1[0].#subform[5].Pt7Line4d_AdditionalInfo[0]")
          .setText(rs?.toUpperCase());
      }

      if (user.data.application.employerone_names.length) {
        let rt = "";

        if (user.data.application.employerone_names[2]?.employer_name)
          // res.push(user.data.application.employerone_names[1].employer_name)
          rt += `${user.data.application.employerone_names[2].employer_name}, `;

        if (user.data.application.employerone_names[2]?.empmailingnumber_name)
          // res.push(user.data.application.employerone_names[2].empmailingnumber_name)
          rt += `${user.data.application.employerone_names[2].empmailingnumber_name} `;

        if (user.data.application.employerone_names[2]?.asfnumberus_name)
          // res.push(user.data.application.employerone_names[2].asfnumberus_name)
          rt += `${user.data.application.employerone_names[2].asfnumberus_name}, `;

        if (user.data.application.employerone_names[2]?.ssste_name)
          // res.push(user.data.application.employerone_names[2].ssste_name)
          rt += `${user.data.application.employerone_names[2].ssste_name}, `;

        if (
          user.data.application.employerone_names[2]
            ?.previousfuturecityemployment_name
        )
          // res.push(user.data.application.employerone_names[2].previousfuturecityemployment_name)
          rt += `${user.data.application.employerone_names[2].previousfuturecityemployment_name}, `;

        if (
          user.data.application.employerone_names[2]
            ?.previousfuturestateemployment_name
        )
          // res.push(user.data.application.employerone_names[2].previousfuturestateemployment_name)
          rt += `${user.data.application.employerone_names[2].previousfuturestateemployment_name}, `;

        if (user.data.application.employerone_names[2]?.employmentzip_name)
          // res.push(user.data.application.employerone_names[2].employmentzip_name)
          rt += `${user.data.application.employerone_names[2].employmentzip_name}, `;

        if (user.data.application.employerone_names[2]?.employmentzip_name)
          // res.push(user.data.application.employerone_names[2].employmentzip_name)
          rt += `${user.data.application.employerone_names[2].employmentzip_name}, `;

        if (user.data.application.employerone_names[2]?.employmentpostal_name)
          // res.push(user.data.application.employerone_names[2].employmentpostal_name)
          rt += `${user.data.application.employerone_names[2].employmentpostal_name}, `;

        if (user.data.application.employerone_names[2]?.employmentpostal_name)
          // res.push(user.data.application.employerone_names[2].employmentpostal_name)
          rt += `${user.data.application.employerone_names[2].employmentpostal_name}, `;

        if (user.data.application.employerone_names[2]?.occupationus_name)
          // res.push(user.data.application.employerone_names[2].occupationus_name)
          rt += `${user.data.application.employerone_names[2].occupationus_name}, `;

        if (
          user.data.application.employerone_names[2]
            ?.addressemployment_name === "USA"
        )
          // res.push(user.data.application.employerone_names[2].addressemployment_name)
          rt += `${user.data.application.employerone_names[2].addressemployment_name}, `;
        else if (
          user.data.application.employerone_names[2]
            ?.addressemployment_name !== "USA" &&
          user.data.application.employerone_names[2]?.addressemployment_name
        )
          // res.push(user.data.application.employerone_names[2]?.countphysical_name)
          rt += `${user.data.application.employerone_names[2]?.countryemployment_name}, `;

        if (user.data.application.employerone_names[2]?.employment_name)
          // res.push(dateFormatter(user.data.application.employerone_names[2].employment_name))
          rt += `${dateFormatter(
            user.data.application.employerone_names[2].employment_name
          )} TO `;

        if (
          user.data.application.employerone_names[2]?.currentemployment_name
        )
          // res.push(dateFormatter(user.data.application.employerone_names[2].currentemployment_name))
          rt += `${dateFormatter(
            user.data.application.employerone_names[2].currentemployment_name
          )} \n`;

        if (user.data.application.employerone_names[3]?.employer_name)
          // res.push(user.data.application.employerone_names[1].employer_name)
          rt += `${user.data.application.employerone_names[3].employer_name}, `;

        if (user.data.application.employerone_names[3]?.empmailingnumber_name)
          // res.push(user.data.application.employerone_names[3].empmailingnumber_name)
          rt += `${user.data.application.employerone_names[3].empmailingnumber_name} `;

        if (user.data.application.employerone_names[3]?.asfnumberus_name)
          // res.push(user.data.application.employerone_names[3].asfnumberus_name)
          rt += `${user.data.application.employerone_names[3].asfnumberus_name}, `;

        if (user.data.application.employerone_names[3]?.ssste_name)
          // res.push(user.data.application.employerone_names[3].ssste_name)
          rt += `${user.data.application.employerone_names[3].ssste_name}, `;

        if (
          user.data.application.employerone_names[3]
            ?.previousfuturecityemployment_name
        )
          // res.push(user.data.application.employerone_names[3].previousfuturecityemployment_name)
          rt += `${user.data.application.employerone_names[3].previousfuturecityemployment_name}, `;

        if (
          user.data.application.employerone_names[3]
            ?.previousfuturestateemployment_name
        )
          // res.push(user.data.application.employerone_names[3].previousfuturestateemployment_name)
          rt += `${user.data.application.employerone_names[3].previousfuturestateemployment_name}, `;

        if (user.data.application.employerone_names[3]?.employmentzip_name)
          // res.push(user.data.application.employerone_names[3].employmentzip_name)
          rt += `${user.data.application.employerone_names[3].employmentzip_name}, `;

        if (user.data.application.employerone_names[3]?.employmentzip_name)
          // res.push(user.data.application.employerone_names[3].employmentzip_name)
          rt += `${user.data.application.employerone_names[3].employmentzip_name}, `;

        if (user.data.application.employerone_names[3]?.employmentpostal_name)
          // res.push(user.data.application.employerone_names[3].employmentpostal_name)
          rt += `${user.data.application.employerone_names[3].employmentpostal_name}, `;

        if (user.data.application.employerone_names[3]?.employmentpostal_name)
          // res.push(user.data.application.employerone_names[3].employmentpostal_name)
          rt += `${user.data.application.employerone_names[3].employmentpostal_name}, `;

        if (user.data.application.employerone_names[3]?.occupationus_name)
          // res.push(user.data.application.employerone_names[3].occupationus_name)
          rt += `${user.data.application.employerone_names[3].occupationus_name}, `;

        if (
          user.data.application.employerone_names[3]
            ?.addressemployment_name === "USA"
        )
          // res.push(user.data.application.employerone_names[3].addressemployment_name)
          rt += `${user.data.application.employerone_names[3].addressemployment_name}, `;
        else if (
          user.data.application.employerone_names[3]
            ?.addressemployment_name !== "USA" &&
          user.data.application.employerone_names[3]?.addressemployment_name
        )
          // res.push(user.data.application.employerone_names[3]?.countphysical_name)
          rt += `${user.data.application.employerone_names[3]?.countryemployment_name}, `;

        if (user.data.application.employerone_names[3]?.employment_name)
          // res.push(dateFormatter(user.data.application.employerone_names[3].employment_name))
          rt += `${dateFormatter(
            user.data.application.employerone_names[3].employment_name
          )} TO `;

        if (
          user.data.application.employerone_names[3]?.currentemployment_name
        )
          // res.push(dateFormatter(user.data.application.employerone_names[3].currentemployment_name))
          rt += `${dateFormatter(
            user.data.application.employerone_names[3].currentemployment_name
          )} \n`;

        form
          .getTextField("form1[0].#subform[5].Pt7Line5d_AdditionalInfo[0]")
          .setText(rt?.toUpperCase());
      }

      if (user.data.application.employerone_names.length) {
        let rt = "";

        if (user.data.application.employerone_names[4]?.employer_name)
          // res.push(user.data.application.employerone_names[1].employer_name)
          rt += `${user.data.application.employerone_names[4].employer_name}, `;

        if (user.data.application.employerone_names[4]?.empmailingnumber_name)
          // res.push(user.data.application.employerone_names[4].empmailingnumber_name)
          rt += `${user.data.application.employerone_names[4].empmailingnumber_name} `;

        if (user.data.application.employerone_names[4]?.asfnumberus_name)
          // res.push(user.data.application.employerone_names[4].asfnumberus_name)
          rt += `${user.data.application.employerone_names[4].asfnumberus_name}, `;

        if (user.data.application.employerone_names[4]?.ssste_name)
          // res.push(user.data.application.employerone_names[4].ssste_name)
          rt += `${user.data.application.employerone_names[4].ssste_name}, `;

        if (
          user.data.application.employerone_names[4]
            ?.previousfuturecityemployment_name
        )
          // res.push(user.data.application.employerone_names[4].previousfuturecityemployment_name)
          rt += `${user.data.application.employerone_names[4].previousfuturecityemployment_name}, `;

        if (
          user.data.application.employerone_names[4]
            ?.previousfuturestateemployment_name
        )
          // res.push(user.data.application.employerone_names[4].previousfuturestateemployment_name)
          rt += `${user.data.application.employerone_names[4].previousfuturestateemployment_name}, `;

        if (user.data.application.employerone_names[4]?.employmentzip_name)
          // res.push(user.data.application.employerone_names[4].employmentzip_name)
          rt += `${user.data.application.employerone_names[4].employmentzip_name}, `;

        if (user.data.application.employerone_names[4]?.employmentzip_name)
          // res.push(user.data.application.employerone_names[4].employmentzip_name)
          rt += `${user.data.application.employerone_names[4].employmentzip_name}, `;

        if (user.data.application.employerone_names[4]?.employmentpostal_name)
          // res.push(user.data.application.employerone_names[4].employmentpostal_name)
          rt += `${user.data.application.employerone_names[4].employmentpostal_name}, `;

        if (user.data.application.employerone_names[4]?.employmentpostal_name)
          // res.push(user.data.application.employerone_names[4].employmentpostal_name)
          rt += `${user.data.application.employerone_names[4].employmentpostal_name}, `;

        if (user.data.application.employerone_names[4]?.occupationus_name)
          // res.push(user.data.application.employerone_names[4].occupationus_name)
          rt += `${user.data.application.employerone_names[4].occupationus_name}, `;

        if (
          user.data.application.employerone_names[4]
            ?.addressemployment_name === "USA"
        )
          // res.push(user.data.application.employerone_names[4].addressemployment_name)
          rt += `${user.data.application.employerone_names[4].addressemployment_name}, `;
        else if (
          user.data.application.employerone_names[4]
            ?.addressemployment_name !== "USA" &&
          user.data.application.employerone_names[4]?.addressemployment_name
        )
          // res.push(user.data.application.employerone_names[4]?.countphysical_name)
          rt += `${user.data.application.employerone_names[4]?.countryemployment_name}, `;

        if (user.data.application.employerone_names[4]?.employment_name)
          // res.push(dateFormatter(user.data.application.employerone_names[4].employment_name))
          rt += `${dateFormatter(
            user.data.application.employerone_names[4].employment_name
          )} TO `;

        if (
          user.data.application.employerone_names[4]?.currentemployment_name
        )
          // res.push(dateFormatter(user.data.application.employerone_names[4].currentemployment_name))
          rt += `${dateFormatter(
            user.data.application.employerone_names[4].currentemployment_name
          )} \n`;

        if (user.data.application.employerone_names[5]?.employer_name)
          // res.push(user.data.application.employerone_names[1].employer_name)
          rt += `${user.data.application.employerone_names[5].employer_name}, `;

        if (user.data.application.employerone_names[5]?.empmailingnumber_name)
          // res.push(user.data.application.employerone_names[5].empmailingnumber_name)
          rt += `${user.data.application.employerone_names[5].empmailingnumber_name} `;

        if (user.data.application.employerone_names[5]?.asfnumberus_name)
          // res.push(user.data.application.employerone_names[5].asfnumberus_name)
          rt += `${user.data.application.employerone_names[5].asfnumberus_name}, `;

        if (user.data.application.employerone_names[5]?.ssste_name)
          // res.push(user.data.application.employerone_names[5].ssste_name)
          rt += `${user.data.application.employerone_names[5].ssste_name}, `;

        if (
          user.data.application.employerone_names[5]
            ?.previousfuturecityemployment_name
        )
          // res.push(user.data.application.employerone_names[5].previousfuturecityemployment_name)
          rt += `${user.data.application.employerone_names[5].previousfuturecityemployment_name}, `;

        if (
          user.data.application.employerone_names[5]
            ?.previousfuturestateemployment_name
        )
          // res.push(user.data.application.employerone_names[5].previousfuturestateemployment_name)
          rt += `${user.data.application.employerone_names[5].previousfuturestateemployment_name}, `;

        if (user.data.application.employerone_names[5]?.employmentzip_name)
          // res.push(user.data.application.employerone_names[5].employmentzip_name)
          rt += `${user.data.application.employerone_names[5].employmentzip_name}, `;

        if (user.data.application.employerone_names[5]?.employmentzip_name)
          // res.push(user.data.application.employerone_names[5].employmentzip_name)
          rt += `${user.data.application.employerone_names[5].employmentzip_name}, `;

        if (user.data.application.employerone_names[5]?.employmentpostal_name)
          // res.push(user.data.application.employerone_names[5].employmentpostal_name)
          rt += `${user.data.application.employerone_names[5].employmentpostal_name}, `;

        if (user.data.application.employerone_names[5]?.employmentpostal_name)
          // res.push(user.data.application.employerone_names[5].employmentpostal_name)
          rt += `${user.data.application.employerone_names[5].employmentpostal_name}, `;

        if (user.data.application.employerone_names[5]?.occupationus_name)
          // res.push(user.data.application.employerone_names[5].occupationus_name)
          rt += `${user.data.application.employerone_names[5].occupationus_name}, `;

        if (
          user.data.application.employerone_names[5]
            ?.addressemployment_name === "USA"
        )
          // res.push(user.data.application.employerone_names[5].addressemployment_name)
          rt += `${user.data.application.employerone_names[5].addressemployment_name}, `;
        else if (
          user.data.application.employerone_names[5]
            ?.addressemployment_name !== "USA" &&
          user.data.application.employerone_names[5]?.addressemployment_name
        )
          // res.push(user.data.application.employerone_names[5]?.countphysical_name)
          rt += `${user.data.application.employerone_names[5]?.countryemployment_name}, `;

        if (user.data.application.employerone_names[5]?.employment_name)
          // res.push(dateFormatter(user.data.application.employerone_names[5].employment_name))
          rt += `${dateFormatter(
            user.data.application.employerone_names[5].employment_name
          )} TO `;

        if (
          user.data.application.employerone_names[5]?.currentemployment_name
        )
          // res.push(dateFormatter(user.data.application.employerone_names[5].currentemployment_name))
          rt += `${dateFormatter(
            user.data.application.employerone_names[5].currentemployment_name
          )} \n`;

        form
          .getTextField("form1[0].#subform[5].Pt7Line6d_AdditionalInfo[0]")
          .setText(rt?.toUpperCase());
      }

      // // Move in date

      // const dzz = new Date(user.data.application.insideusdate_name);

      // form.getTextField('form1[0].#subform[2].P4_Line6_DateOfBirth[0]').setText((dzz.getMonth()+1)+ '/' + dzz.getDate() + '/' +  dzz.getFullYear());

      if (user.data.application.recentstreet_name) {
        form
          .getTextField("form1[0].#subform[0].Pt1Line8a_StreetNumberName[0]")
          .setText(user.data.application.recentstreet_name?.toUpperCase());
      }

      if (user.data.application.recentapt_name == "12") {
        form.getCheckBox("form1[0].#subform[0].Pt1Line8b_Unit[0]").check();
      } else {
        form.getCheckBox("form1[0].#subform[0].Pt1Line8b_Unit[0]").uncheck();
      }

      if (user.data.application.recentapt_name == "13") {
        form.getCheckBox("form1[0].#subform[0].Pt1Line8b_Unit[1]").check();
      } else {
        form.getCheckBox("form1[0].#subform[0].Pt1Line8b_Unit[1]").uncheck();
      }

      if (user.data.application.recentapt_name == "14") {
        form.getCheckBox("form1[0].#subform[0].Pt1Line8b_Unit[2]").check();
      } else {
        form.getCheckBox("form1[0].#subform[0].Pt1Line8b_Unit[2]").uncheck();
      }

      if (user.data.application.recentste_name) {
        form
          .getTextField("form1[0].#subform[0].Pt1Line8b_AptSteFlrNumber[0]")
          .setText(user.data.application.recentste_name?.toUpperCase());
      }

      if (user.data.application.recentcity_name) {
        form
          .getTextField("form1[0].#subform[0].Pt1Line8c_CityOrTown[0]")
          .setText(
            user.data.application.recentcity_name?.toUpperCase().slice(0, 22)
          );
      }

      if (user.data.application.recentprovince_name) {
        form
          .getTextField("form1[0].#subform[0].Pt1Line8d_Province[0]")
          .setText(user.data.application.recentprovince_name?.toUpperCase());
      }

      if (user.data.application.recentpostal_name) {
        form
          .getTextField("form1[0].#subform[0].Pt1Line8e_PostalCode[0]")
          .setText(user.data.application.recentpostal_name?.toUpperCase());
      }

      if (user.data.application.recentcountry_name) {
        form
          .getTextField("form1[0].#subform[0].Pt1Line8f_Country[0]")
          .setText(user.data.application.recentcountry_name?.toUpperCase());
      }

      if (user.data.application.usoneyearnumber_name) {
        form
          .getTextField("form1[0].#subform[0].Pt1Line8a_StreetNumberName[0]")
          .setText(user.data.application.usoneyearnumber_name?.toUpperCase());
      }

      if (user.data.application.usoneyearany_name == "Apt.") {
        form.getCheckBox("form1[0].#subform[0].Pt1Line8b_Unit[0]").check();
      } else {
        form.getCheckBox("form1[0].#subform[0].Pt1Line8b_Unit[0]").uncheck();
      }

      if (user.data.application.usoneyearany_name == "Ste.") {
        form.getCheckBox("form1[0].#subform[0].Pt1Line8b_Unit[1]").check();
      } else {
        form.getCheckBox("form1[0].#subform[0].Pt1Line8b_Unit[1]").uncheck();
      }

      if (user.data.application.usoneyearany_name == "Flr.") {
        form.getCheckBox("form1[0].#subform[0].Pt1Line8b_Unit[2]").check();
      } else {
        form.getCheckBox("form1[0].#subform[0].Pt1Line8b_Unit[2]").uncheck();
      }

      if (user.data.application.usoneyearflr_name) {
        form
          .getTextField("form1[0].#subform[0].Pt1Line8b_AptSteFlrNumber[0]")
          .setText(user.data.application.usoneyearflr_name?.toUpperCase());
      }

      if (user.data.application.usoneyearcity_name) {
        form
          .getTextField("form1[0].#subform[0].Pt1Line8c_CityOrTown[0]")
          .setText(
            user.data.application.usoneyearcity_name
              ?.toUpperCase()
              .slice(0, 20)
          );
      }

      if (user.data.application.usoneyearprovince_name) {
        form
          .getTextField("form1[0].#subform[0].Pt1Line8d_Province[0]")
          .setText(
            user.data.application.usoneyearprovince_name?.toUpperCase()
          );
      }

      if (user.data.application.usoneyearcode_name) {
        form
          .getTextField("form1[0].#subform[0].Pt1Line8e_PostalCode[0]")
          .setText(user.data.application.usoneyearcode_name?.toUpperCase());
      }

      if (user.data.application.usoneyearcountry_name) {
        form
          .getTextField("form1[0].#subform[0].Pt1Line8f_Country[0]")
          .setText(
            user.data.application.usoneyearcountry_name?.toUpperCase()
          );
      }

      // Move in date

      // const lkjasdsa = user.data.application.usoneyearindate_name;
      // if (Array.isArray(lkjasdsa) && lkjasdsa.length) {
      // 	const lkj = new Date(lkjasdsa[0]);
      // 	if (isNaN(lkj) || !lkj) lkj = new Date();
      // 	let date_to_fillpp = (lkj.getMonth() < 9 && '0' || '') + (lkj.getMonth() + 1) + '/';
      // 	date_to_fillpp += (lkj.getDate() < 10 && '0' || '') + lkj.getDate() + '/' + lkj.getFullYear();
      // 	form.getTextField('form1[0].#subform[1].Pt1Line9b_DateTo[0]').setText(date_to_fillpp.toLocaleString());
      // }

      // if (user.data.application.usoneyearoutdate_name) {
      //   form
      //     .getTextField("form1[0].#subform[1].Pt1Line9b_DateTo[0]")
      //     .setText(
      //       dateFormatter(user.data.application.usoneyearoutdate_name)
      //     );
      // }

      // Move out date

      // const xcvqqq = user.data.application.usoneyearoutdate_name;
      // if (Array.isArray(xcvqqq) && xcvqqq.length) {
      // 	const xcv = new Date(xcvqqq[0]);
      // 	if (isNaN(xcv) || !xcv) xcv = new Date();
      // 	let date_to_fillaa = (xcv.getMonth() < 9 && '0' || '') + (xcv.getMonth() + 1) + '/';
      // 	date_to_fillaa += (xcv.getDate() < 10 && '0' || '') + xcv.getDate() + '/' + xcv.getFullYear();
      // 	form.getTextField('form1[0].#subform[1].Pt1Line9a_DateFrom[0]').setText(date_to_fillaa.toLocaleString());
      // }

      // if (user.data.application.usoneyearindate_name) {
      //   form
      //     .getTextField("form1[0].#subform[1].Pt1Line9a_DateFrom[0]")
      //     .setText(dateFormatter(user.data.application.usoneyearindate_name));
      // }

      // PREVIOUS PHYSICAL ADDRESS 1

      if (Array.isArray(user.data.application.typeofaddress_names)) {
        if (user.data.application.typeofaddress_names.length > 0) {
          // Street number and name

          if (user.data.application.typeofaddress_names[0].usplaces_name) {
            form
              .getTextField(
                "form1[0].#subform[0].Pt1Line6a_StreetNumberName[0]"
              )
              .setText(
                user.data.application.typeofaddress_names[0].usplaces_name?.toUpperCase()
              );
          }

          // Apt./Ste./Flr. Number (if any)

          if (
            user.data.application.typeofaddress_names[0].numberaptste_name ==
            "Apt"
          ) {
            form
              .getCheckBox("form1[0].#subform[0].Pt1Line6b_Unit[0]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[0].Pt1Line6b_Unit[0]")
              .uncheck();
          }

          if (
            user.data.application.typeofaddress_names[0].numberaptste_name ==
            "Ste"
          ) {
            form
              .getCheckBox("form1[0].#subform[0].Pt1Line6b_Unit[1]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[0].Pt1Line6b_Unit[1]")
              .uncheck();
          }

          if (
            user.data.application.typeofaddress_names[0].numberaptste_name ==
            "Flr"
          ) {
            form
              .getCheckBox("form1[0].#subform[0].Pt1Line6b_Unit[2]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[0].Pt1Line6b_Unit[2]")
              .uncheck();
          }

          if (user.data.application.typeofaddress_names[0].stedf_name) {
            form
              .getTextField(
                "form1[0].#subform[0].Pt1Line6b_AptSteFlrNumber[0]"
              )
              .setText(
                user.data.application.typeofaddress_names[0].stedf_name?.toUpperCase()
              );
          }
          // City or town

          if (
            user.data.application.typeofaddress_names[0]
              .previousfuturecityq_name
          ) {
            form
              .getTextField("form1[0].#subform[0].Pt1Line6c_CityOrTown[0]")
              .setText(
                user.data.application.typeofaddress_names[0].previousfuturecityq_name
                  ?.toUpperCase()
                  .slice(0, 20)
              );
          }

          // Province

          if (
            user.data.application.typeofaddress_names[0].futurfuturestate_name
          ) {
            form
              .getTextField("form1[0].#subform[0].Pt1Line6f_Province[0]")
              .setText(
                user.data.application.typeofaddress_names[0].futurfuturestate_name?.toUpperCase()
              );
          }

          // ZIP Code

          if (
            user.data.application.typeofaddress_names[0]
              .previousfuturewzyzip_name
          ) {
            form
              .getTextField("form1[0].#subform[0].Pt1Line6e_ZipCode[0]")
              .setText(
                user.data.application.typeofaddress_names[0].previousfuturewzyzip_name?.toUpperCase()
              );
          }

          // Postal code

          if (
            user.data.application.typeofaddress_names[0]
              .futurepreviousfutu_name
          ) {
            form
              .getTextField("form1[0].#subform[0].Pt1Line6g_PostalCode[0]")
              .setText(
                user.data.application.typeofaddress_names[0].futurepreviousfutu_name?.toUpperCase()
              );
          }

          // Country

          if (
            user.data.application.typeofaddress_names[0]
              .recenstcountryfuture_name
          ) {
            form
              .getTextField("form1[0].#subform[0].Pt1Line6h_Country[0]")
              .setText(
                user.data.application.typeofaddress_names[0].recenstcountryfuture_name?.toUpperCase()
              );
          }
          // State

          if (
            user.data.application.typeofaddress_names[0]
              .prweviousfuturestate_name
          ) {
            form
              .getDropdown("form1[0].#subform[0].Pt1Line6d_State[0]")
              .select(
                user.data.application.typeofaddress_names[0]
                  .prweviousfuturestate_name
              );
          }

          // Move in date

          // const sssssfghfhf = user.data.application.typeofaddress_names[1].previousmovein_name;
          // if (Array.isArray(sssssfghfhf) && sssssfghfhf.length) {
          // 	const lllcd = new Date(sssssfghfhf[0]);
          // 	if (isNaN(lllcd) || !lllcd) lllcd = new Date();
          // 	let date_to_fillff = (lllcd.getMonth() < 9 && '0' || '') + (lllcd.getMonth() + 1) + '/';
          // 	date_to_fillff += (lllcd.getDate() < 10 && '0' || '') + lllcd.getDate() + '/' + lllcd.getFullYear();
          // 	form.getTextField('form1[0].#subform[0].Pt1Line7a_DateFrom[0]').setText(date_to_fillff.toLocaleString());
          // }

          // if (
          //   user.data.application.typeofaddress_names[0].previousmovein_name
          // ) {
          //   form
          //     .getTextField("form1[0].#subform[0].Pt1Line7a_DateFrom[0]")
          //     .setText(
          //       dateFormatter(
          //         user.data.application.typeofaddress_names[0]
          //           .previousmovein_name
          //       )
          //     );
          // }

          // Move out date

          // const hhhdcdfgdfg = user.data.application.typeofaddress_names[1].previousmoveout_name;
          // if (Array.isArray(hhhdcdfgdfg) && hhhdcdfgdfg.length) {
          // 	const hhhdc = new Date(hhhdcdfgdfg[0]);
          // 	if (isNaN(hhhdc) || !hhhdc) hhhdc = new Date();
          // 	let date_to_fillgg = (hhhdc.getMonth() < 9 && '0' || '') + (hhhdc.getMonth() + 1) + '/';
          // 	date_to_fillgg += (hhhdc.getDate() < 10 && '0' || '') + hhhdc.getDate() + '/' + hhhdc.getFullYear();
          // 	form.getTextField('form1[0].#subform[0].Pt1Line7b_DateTo[0]').setText(date_to_fillgg.toLocaleString());
          // }

          // if (
          //   user.data.application.typeofaddress_names[0].previousmoveout_name
          // ) {
          //   form
          //     .getTextField("form1[0].#subform[0].Pt1Line7b_DateTo[0]")
          //     .setText(
          //       dateFormatter(
          //         user.data.application.typeofaddress_names[0]
          //           .previousmoveout_name
          //       )
          //     );
          // }
        }
      }

      let src = `${__dirname}/pdf_forms/i-130a_done.pdf`;
      const pdfBytes = await pdfDoc.save();
      fs.writeFileSync(src, Buffer.from(pdfBytes));
      res.sendFile(src);
    }
  });
}

const pdfDownload131 = async (req, res) => {

    const existingPdfBytes = fs.readFileSync(`${__dirname}/pdf_forms/i-131.pdf`);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const form = pdfDoc.getForm();
    //temp
    const fields = form.getFields();
    fields.forEach((field) => {
        const name = field.getName();
        console.log(`${name} `);
    });
    //temp
    Data.findOne({
        _id: req.params.user_id,
    }).exec(async function (err, user) {
        if (user) {
        // Applicant info

        // Given name (first name)

        if (user.data.application.name) {
            form
            .getTextField("form1[0].#subform[0].Line1b_GivenName[0]")
            .setText(user.data.application.name?.toUpperCase());
        }

        // Middle name

        if (user.data.application.middle_name) {
            form
            .getTextField("form1[0].#subform[0].Line1c_MiddleName[0]")
            .setText(user.data.application.middle_name?.toUpperCase());
        }

        // Family name (last name)

        if (user.data.application.family_name) {
            form
            .getTextField("form1[0].#subform[0].Line1a_FamilyName[0]")
            .setText(user.data.application.family_name?.toUpperCase());
        }

        // Some basic info about JERRY

        // Sex

        if (user.data.application.basicinfo_name == "Female") {
            form.getCheckBox("form1[0].#subform[0].Line7_Female[0]").check();
        } else {
            form.getCheckBox("form1[0].#subform[0].Line7_Female[0]").uncheck();
        }

        if (user.data.application.basicinfo_name == "Male") {
            form.getCheckBox("form1[0].#subform[0].Line7_Male[0]").check();
        } else {
            form.getCheckBox("form1[0].#subform[0].Line7_Male[0]").uncheck();
        }

        // Country of citizenship or nationality

        if (Array.isArray(user.data.application.country_names)) {
            if (user.data.application.country_names.length) {
            form
                .getTextField(
                "form1[0].#subform[0].Line5_CountryOfCitizenship[0]"
                )
                .setText(user.data.application.country_names[0].country_name);
            }
        }

        if (user.data.application.citizenship_name) {
            form
            .getTextField("form1[0].#subform[0].Line8_DateOfBirth[0]")
            .setText(dateFormatter(user.data.application.citizenship_name));
        }

        // Country of birth

        if (user.data.application.birth_name) {
            form
            .getTextField("form1[0].#subform[0].Line4_CountryOfBirth[0]")
            .setText(user.data.application.birth_name);
        }

        if (user.data.application.appsignaturedate_name) {
            form
            .getTextField("form1[0].#subform[4].Line1b_DateOfSignature[0]")
            .setText(
                dateFormatter(user.data.application.appsignaturedate_name)
            );
        }

        // Does JERRY want to apply for an Advance Parole Document?

        if (user.data.application.wanttoapplyforan_name == "yes") {
            form.getCheckBox("form1[0].#subform[1].Line1d_checkbox[0]").check();
        } else {
            form.getCheckBox("form1[0].#subform[1].Line1d_checkbox[0]").uncheck();
        }

        // JERRY's U.S. social security number

        if (
            user.data.application.securitynumberone_name +
            user.data.application.securitynumbertwo_name +
            user.data.application.securitynumberthree_name
        ) {
            form
            .getTextField("form1[0].#subform[0].#area[2].Line9_SSN[0]")
            .setText(
                user.data.application.securitynumberone_name +
                user.data.application.securitynumbertwo_name +
                user.data.application.securitynumberthree_name
            );
        }
        // Daytime phone number
        if (user.data.application.phonenumber_name) {
            const cleanPhone = user.data.application.phonenumber_name.replace(
            /\D/g,
            ""
            );
            const separatePhone = cleanPhone.split(/^(\d{3})(\d{3})(\d{4})$/);

            if (separatePhone[1]) {
            form
                .getTextField(
                "form1[0].#subform[4].#area[7].Line2_DaytimePhoneNumber1[0]"
                )
                .setText(separatePhone[1].toString());
            }

            if (separatePhone[2]) {
            form
                .getTextField(
                "form1[0].#subform[4].#area[7].Line2_DaytimePhoneNumber2[0]"
                )
                .setText(separatePhone[2].toString());
            }

            if (separatePhone[3]) {
            form
                .getTextField(
                "form1[0].#subform[4].#area[7].Line2_DaytimePhoneNumber3[0]"
                )
                .setText(separatePhone[3].toString());
            }
        }

        // Immigration status on Form I-94

        if (user.data.application.form94middleform_name) {
            form
            .getTextField("form1[0].#subform[0].Line6_ClassofAdmission[0]")
            .setText(user.data.application.form94middleform_name);
        }

        // JERRY's Alien registration number (A-number) (if any)

        if (user.data.application.usregistrationnumber_name) {
            form
            .getTextField("form1[0].#subform[0].#area[1].Line3_AlienNumber[0]")
            .setText(user.data.application.usregistrationnumber_name);
        }

        if (user.data.application.name) {
            form
            .getTextField("form1[0].#subform[2].Line1a_Purpose[0]")
            .setText("FAMILY VISIT");
        }

        if (
            user.data.application.country_names &&
            user.data.application.country_names.length
        ) {
            form
            .getTextField("form1[0].#subform[2].Line1b_ListCountries[0]")
            .setText(
                user.data.application.country_names
                .map((e) => e.country_name?.toUpperCase())
                .join(",")
            );
        }

        // Places lived

        // About jerry's mailing address inside the U.S.

        if (user.data.application.insponsorincare_name) {
            form
            .getTextField("form1[0].#subform[0].Line2a_InCareofName[0]")
            .setText(user.data.application.insponsorincare_name?.toUpperCase());
        }
        if (user.data.application.mailingaddressus_name === "no") {
            // Street number and name

            if (user.data.application.insideusnumber_name) {
            form
                .getTextField("form1[0].#subform[0].Line2b_StreetNumberName[0]")
                .setText(
                user.data.application.insideusnumber_name
                    ?.toUpperCase()
                    ?.slice(0, 25)
                );
            }

            // Apt./Ste./Flr. Number (if any)

            if (user.data.application.insideusifany_name == "Ste") {
            form.getCheckBox("form1[0].#subform[0].Line2c_Unit[0]").check();
            } else {
            form.getCheckBox("form1[0].#subform[0].Line2c_Unit[0]").uncheck();
            }

            if (user.data.application.insideusifany_name == "Flr") {
            form.getCheckBox("form1[0].#subform[0].Line2c_Unit[1]").check();
            } else {
            form.getCheckBox("form1[0].#subform[0].Line2c_Unit[1]").uncheck();
            }

            if (user.data.application.insideusifany_name == "Apt") {
            form.getCheckBox("form1[0].#subform[0].Line2c_Unit[2]").check();
            } else {
            form.getCheckBox("form1[0].#subform[0].Line2c_Unit[2]").uncheck();
            }

            if (user.data.application.usifanyselest_name) {
            form
                .getTextField("form1[0].#subform[0].Line2c_AptSteFlrNumber[0]")
                .setText(user.data.application.usifanyselest_name?.toUpperCase());
            }

            // City or town

            if (user.data.application.insideusgcity_name) {
            form
                .getTextField("form1[0].#subform[0].Line2d_CityOrTown[0]")
                .setText(user.data.application.insideusgcity_name?.toUpperCase());
            }

            // State

            if (user.data.application.insideusstate_name) {
            form
                .getDropdown("form1[0].#subform[0].Line2e_State[0]")
                .select(user.data.application.insideusstate_name);
            }

            // Zip Code

            if (user.data.application.insideuscode_name) {
            form
                .getTextField("form1[0].#subform[0].Line2f_ZipCode[0]")
                .setText(user.data.application.insideuscode_name?.toUpperCase());
            }
        }

        if (user.data.application.mailingaddress_name === "USA") {
            form
            .getTextField("form1[0].#subform[0].Line2i_Country[0]")
            .setText("USA"?.toUpperCase());
        }

        if (user.data.application.mailingaddressus_name !== "no") {
            if (user.data.application.mailing_name) {
            form
                .getTextField("form1[0].#subform[0].Line2a_InCareofName[0]")
                .setText(user.data.application.mailing_name?.toUpperCase());
            }

            // Street number and name

            if (user.data.application.mailingnumber_name) {
            form
                .getTextField("form1[0].#subform[0].Line2b_StreetNumberName[0]")
                .setText(
                user.data.application.mailingnumber_name
                    ?.toUpperCase()
                    ?.slice(0, 25)
                );
            }

            // Apt./Ste./Flr. Number (if any)

            if (user.data.application.apt_name == "steaplase") {
            form.getCheckBox("form1[0].#subform[0].Line2c_Unit[0]").check();
            } else {
            form.getCheckBox("form1[0].#subform[0].Line2c_Unit[0]").uncheck();
            }

            if (user.data.application.apt_name == "flrpalase") {
            form.getCheckBox("form1[0].#subform[0].Line2c_Unit[1]").check();
            } else {
            form.getCheckBox("form1[0].#subform[0].Line2c_Unit[1]").uncheck();
            }

            if (user.data.application.apt_name == "aptplase") {
            form.getCheckBox("form1[0].#subform[0].Line2c_Unit[2]").check();
            } else {
            form.getCheckBox("form1[0].#subform[0].Line2c_Unit[2]").uncheck();
            }

            if (user.data.application.selectste_name) {
            form
                .getTextField("form1[0].#subform[0].Line2c_AptSteFlrNumber[0]")
                .setText(user.data.application.selectste_name?.toUpperCase());
            }

            // City or town

            if (user.data.application.mailingcity_name) {
            form
                .getTextField("form1[0].#subform[0].Line2d_CityOrTown[0]")
                .setText(user.data.application.mailingcity_name?.toUpperCase());
            }

            // State

            if (user.data.application.insidemailingprovince_name) {
            form
                .getDropdown("form1[0].#subform[0].Line2e_State[0]")
                .select(user.data.application.insidemailingprovince_name);
            }

            // Zip Code

            if (user.data.application.mailingpostalcode_name) {
            form
                .getTextField("form1[0].#subform[0].Line2f_ZipCode[0]")
                .setText(user.data.application.mailingpostalcode_name);
            }

            // Country
        }

        if (user.data.application.sponsortypeaddress_name === "USA") {
            form
            .getTextField("form1[0].#subform[0].Line2i_Country[0]")
            .setText("USA"?.toUpperCase());
        }

    
        if (user.data.application.sntendeddeparture_name) {
            form
            .getTextField("form1[0].#subform[1].Line1_DateIntendedDeparture[0]")
            .setText(
                dateFormatter(user.data.application.sntendeddeparture_name)
            );
        }

        if (user.data.application.xpectedlengthoftrip_name) {
            form
            .getTextField("form1[0].#subform[1].Line2_ExpectedLengthTrip[0]")
            .setText(
                user.data.application.xpectedlengthoftrip_name?.toUpperCase()
            );
        }

        // are you or

        if (user.data.application.injudicialproceedings_name == "yes") {
            form.getCheckBox("form1[0].#subform[1].Line3a_Yes[0]").check();
        } else {
            form.getCheckBox("form1[0].#subform[1].Line3a_Yes[0]").uncheck();
        }
        if (user.data.application.injudicialproceedings_name == "no") {
            form.getCheckBox("form1[0].#subform[1].Line3a_No[0]").check();
        } else {
            form.getCheckBox("form1[0].#subform[1].Line3a_No[0]").uncheck();
        }

        // us inside
        if (user.data.application.judicialproceedings_name == "yes") {
            form.getCheckBox("form1[0].#subform[1].Line3a_Yes[0]").check();
        } else {
            form.getCheckBox("form1[0].#subform[1].Line3a_Yes[0]").uncheck();
        }
        if (user.data.application.judicialproceedings_name == "no") {
            form.getCheckBox("form1[0].#subform[1].Line3a_No[0]").check();
        } else {
            form.getCheckBox("form1[0].#subform[1].Line3a_No[0]").uncheck();
        }

        // us inside
        // When 1 last arrived in the U.S., 1 was admitted as a:

        if (user.data.application.arrivedintheus_name) {
            form
            .getTextField("form1[0].#subform[0].Line6_ClassofAdmission[0]")
            .setText(user.data.application.arrivedintheus_name);
        }

        // Does jerry intend to travel outside the U.S. more than once using this document?

        if (user.data.application.intendtotraveloutside_name == "yes") {
            form.getCheckBox("form1[0].#subform[3].Line1_OneTrip[0]").check();
        } else {
            form.getCheckBox("form1[0].#subform[3].Line1_OneTrip[0]").uncheck();
        }

        if (user.data.application.intendtotraveloutside_name == "no") {
            form.getCheckBox("form1[0].#subform[3].Line1_MoreThanOne[0]").check();
        } else {
            form
            .getCheckBox("form1[0].#subform[3].Line1_MoreThanOne[0]")
            .uncheck();
        }

        // Has jerry ever before been issued a reentry permit or Refugee Travel Document?

        if (user.data.application.areentrypermitor_name == "yes") {
            form.getCheckBox("form1[0].#subform[1].Line4a_Yes[0]").check();
        } else {
            form.getCheckBox("form1[0].#subform[1].Line4a_Yes[0]").uncheck();
        }
        if (user.data.application.areentrypermitor_name == "no") {
            form.getCheckBox("form1[0].#subform[1].Line4a_No[0]").check();
        } else {
            form.getCheckBox("form1[0].#subform[1].Line4a_No[0]").uncheck();
        }

        let src = `${__dirname}/pdf_forms/i-131_done.pdf`;
        const pdfBytes = await pdfDoc.save();
        fs.writeFileSync(src, Buffer.from(pdfBytes));

        res.sendFile(src);
        }
    });

}

const pdfDownload485 = async (req, res) => {
  
  const existingPdfBytes = fs.readFileSync(`${__dirname}/pdf_forms/i-485.pdf`);
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const form = pdfDoc.getForm();
  //temp
  const fields = form.getFields();
  fields.forEach((field) => {
    const name = field.getName();
    console.log(`${name} `);
  });
  //temp
  Data.findOne({
    _id: req.params.user_id,
  }).exec(async function (err, user) {
    if (user) {
      // Applicant info
      // What's JERRY's full legal name?

      if (user.data.application.thisiscurrentemployment_name) {
        form
          .getTextField("form1[0].#subform[5].Pt3Line14b_DateTo[0]")
          .setText("PRESENT");
      }

      if (user.data.application.name) {
        form
          .getTextField("form1[0].#subform[0].Pt1Line1b_GivenName[0]")
          .setText(user.data.application.name?.toUpperCase());
      }

      if (user.data.application.family_name) {
        form
          .getTextField("form1[0].#subform[0].Pt1Line1a_FamilyName[0]")
          .setText(user.data.application.family_name?.toUpperCase());
      }

      if (user.data.application.middle_name) {
        form
          .getTextField("form1[0].#subform[0].Pt1Line1c_MiddleName[0]")
          .setText(user.data.application.middle_name?.toUpperCase());
      }

      if (user.data.application.appsignaturedate_name) {
        form
          .getTextField("form1[0].#subform[16].Pt10Line6b_Date[0]")
          .setText(
            dateFormatter(user.data.application.appsignaturedate_name)
          );
      }

      // Has JERRY ever used names other than "JERRY " since birth?

      if (Array.isArray(user.data.application.other_names)) {
        if (user.data.application.other_names.length > 0) {
          if (user.data.application.other_names[0].sublastname_name) {
            form
              .getTextField("form1[0].#subform[0].Pt1Line2a_FamilyName[0]")
              .setText(
                user.data.application.other_names[0].sublastname_name?.toUpperCase()
              );
          }
          if (user.data.application.other_names[0].subfirstname_name) {
            form
              .getTextField("form1[0].#subform[0].Pt1Line2b_GivenName[0]")
              .setText(
                user.data.application.other_names[0].subfirstname_name?.toUpperCase()
              );
          }
          if (user.data.application.other_names[0].submiddlename_name) {
            form
              .getTextField("form1[0].#subform[0].Pt1Line2c_MiddleName[0]")
              .setText(
                user.data.application.other_names[0].submiddlename_name?.toUpperCase()
              );
          }

          if (user.data.application.other_names.length > 1) {
            if (user.data.application.other_names[1].sublastname_name) {
              form
                .getTextField("form1[0].#subform[0].Pt1Line3a_FamilyName[0]")
                .setText(
                  user.data.application.other_names[1].sublastname_name?.toUpperCase()
                );
            }
            if (user.data.application.other_names[1].subfirstname_name) {
              form
                .getTextField("form1[0].#subform[0].Pt1Line3b_GivenName[0]")
                .setText(
                  user.data.application.other_names[1].subfirstname_name?.toUpperCase()
                );
            }

            if (user.data.application.other_names[1].submiddlename_name) {
              form
                .getTextField("form1[0].#subform[0].Pt1Line3c_MiddleName[0]")
                .setText(
                  user.data.application.other_names[1].submiddlename_name?.toUpperCase()
                );
            }
          }

          if (user.data.application.other_names.length > 2) {
            if (user.data.application.other_names[2].sublastname_name) {
              form
                .getTextField("form1[0].#subform[0].Pt1Line4a_FamilyName[0]")
                .setText(
                  user.data.application.other_names[2].sublastname_name?.toUpperCase()
                );
            }
            if (user.data.application.other_names[2].subfirstname_name) {
              form
                .getTextField("form1[0].#subform[0].Pt1Line4b_GivenName[0]")
                .setText(
                  user.data.application.other_names[2].subfirstname_name?.toUpperCase()
                );
            }
            if (user.data.application.other_names[2].submiddlename_name) {
              form
                .getTextField("form1[0].#subform[0].Pt1Line4c_MiddleName[0]")
                .setText(
                  user.data.application.other_names[2].submiddlename_name?.toUpperCase()
                );
            }
          }

          // Some basic info about JERRY

          if (user.data.application.basicinfo_name === "Female") {
            form
              .getCheckBox("form1[0].#subform[0].Pt1Line6_Gender[0]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[0].Pt1Line6_Gender[0]")
              .uncheck();
          }
          if (user.data.application.basicinfo_name === "Male") {
            form
              .getCheckBox("form1[0].#subform[0].Pt1Line6_Gender[1]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[0].Pt1Line6_Gender[1]")
              .uncheck();
          }

          // Public charge ground of inadmissibility

          if (user.data.application.administration_name === "no") {
            form.getCheckBox("form1[0].#subform[1].Pt1Line14_YN[0]").check();
          } else {
            form
              .getCheckBox("form1[0].#subform[1].Pt1Line14_YN[0]")
              .uncheck();
          }

          if (user.data.application.administration_name === "yes") {
            form.getCheckBox("form1[0].#subform[1].Pt1Line14_YN[1]").check();
          } else {
            form
              .getCheckBox("form1[0].#subform[1].Pt1Line14_YN[1]")
              .uncheck();
          }

          if (
            user.data.application.securitynumberone_name +
            user.data.application.securitynumbertwo_name +
            user.data.application.securitynumberthree_name
          ) {
            form
              .getTextField("form1[0].#subform[1].Pt1Line15_SSN[0]")
              .setText(
                user.data.application.securitynumberone_name +
                  user.data.application.securitynumbertwo_name +
                  user.data.application.securitynumberthree_name
              );
          }

          if (user.data.application.administrationoo_name === "no") {
            form.getCheckBox("form1[0].#subform[1].Pt1Line16_YN[0]").check();
          } else {
            form
              .getCheckBox("form1[0].#subform[1].Pt1Line16_YN[0]")
              .uncheck();
          }

          if (user.data.application.administrationoo_name === "yes") {
            form.getCheckBox("form1[0].#subform[1].Pt1Line16_YN[1]").check();
          } else {
            form
              .getCheckBox("form1[0].#subform[1].Pt1Line16_YN[1]")
              .uncheck();
          }

          if (user.data.application.aadministrationoo_name === "no") {
            form.getCheckBox("form1[0].#subform[1].Pt1Line17_YN[0]").check();
          } else {
            form
              .getCheckBox("form1[0].#subform[1].Pt1Line17_YN[0]")
              .uncheck();
          }

          if (user.data.application.aadministrationoo_name === "yes") {
            form.getCheckBox("form1[0].#subform[1].Pt1Line17_YN[1]").check();
          } else {
            form
              .getCheckBox("form1[0].#subform[1].Pt1Line17_YN[1]")
              .uncheck();
          }

          // Daytime phone number

          if (user.data.application.phonenumber_name) {
            form
              .getTextField("form1[0].#subform[15].Pt10Line3_DaytimePhone[0]")
              .setText(user.data.application.phonenumber_name?.slice(0, 15));
          }

          // Mobile phone number (if any)

          if (user.data.application.mobile_name) {
            form
              .getTextField("form1[0].#subform[15].Pt10Line4_MobilePhone[0]")
              .setText(user.data.application.mobile_name?.slice(0, 15));
          }

          // Email address (if any)

          if (user.data.application.register_name) {
            form
              .getTextField("form1[0].#subform[15].Pt10Line5_Email[0]")
              .setText(user.data.application.register_name?.toUpperCase());
          }

          if (user.data.application.publiccheck_name === "no") {
            form
              .getCheckBox("form1[0].#subform[12].Pt8Line61_YesNo[1]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[12].Pt8Line61_YesNo[1]")
              .uncheck();
          }

          if (user.data.application.publiccheck_name === "yes") {
            form
              .getCheckBox("form1[0].#subform[12].Pt8Line61_YesNo[0]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[12].Pt8Line61_YesNo[0]")
              .uncheck();
          }

          if (user.data.application.form94middleqqq_name) {
            form
              .getTextField("form1[0].#subform[2].Pt1Line27_Status[0]")
              .setText(
                user.data.application.form94middleqqq_name?.toUpperCase()
              );
          }

          // if (user.data.application.publiccheck_name === 'no') {
          //   form.getCheckBox('form1[0].#subform[12].Pt8Line61_YesNo[0]').check();
          // } else{

          //   if (user.data.application.publiccheck_name === 'no') {
          //     form.getCheckBox('form1[0].#subform[12].Pt8Line61_YesNo[0]').check();

          // }
          // if (user.data.application.publiccheck_name === 'yes') {
          //   form.getCheckBox('form1[0].#subform[0].Pt1Line6_Gender[1]').check();
          // } else {
          //   form.getCheckBox('form1[0].#subform[0].Pt1Line6_Gender[1]').uncheck();
          // }

          // Identify the total value of

          if (user.data.application.isinadmissibility_name == "$0") {
            form.getCheckBox("form1[0].#subform[13].Pt8Line65_CB[0]").check();
          } else {
            form
              .getCheckBox("form1[0].#subform[13].Pt8Line65_CB[0]")
              .uncheck();
          }

          if (user.data.application.isinadmissibility_name == "$1-10,100") {
            form.getCheckBox("form1[0].#subform[13].Pt8Line65_CB[1]").check();
          } else {
            form
              .getCheckBox("form1[0].#subform[13].Pt8Line65_CB[1]")
              .uncheck();
          }

          if (
            user.data.application.isinadmissibility_name == "$10,101-57,700"
          ) {
            form.getCheckBox("form1[0].#subform[13].Pt8Line65_CB[2]").check();
          } else {
            form
              .getCheckBox("form1[0].#subform[13].Pt8Line65_CB[2]")
              .uncheck();
          }

          if (
            user.data.application.isinadmissibility_name == "$57,701-186,800"
          ) {
            form.getCheckBox("form1[0].#subform[13].Pt8Line65_CB[3]").check();
          } else {
            form
              .getCheckBox("form1[0].#subform[13].Pt8Line65_CB[3]")
              .uncheck();
          }

          if (
            user.data.application.isinadmissibility_name == "Over $186,800"
          ) {
            form.getCheckBox("form1[0].#subform[13].Pt8Line65_CB[4]").check();
          } else {
            form
              .getCheckBox("form1[0].#subform[13].Pt8Line65_CB[4]")
              .uncheck();
          }

          if (user.data.application.publicheck_name == "yes") {
            form
              .getCheckBox("form1[0].#subform[13].Pt8Line68a_YesNo[0]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[13].Pt8Line68a_YesNo[0]")
              .uncheck();
          }

          if (user.data.application.publicheck_name == "no") {
            form
              .getCheckBox("form1[0].#subform[13].Pt8Line68a_YesNo[1]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[13].Pt8Line68a_YesNo[1]")
              .uncheck();
          }

          if (user.data.application.publicheck_name == "yes") {
            form
              .getCheckBox("form1[0].#subform[13].Pt8Line68b_YesNo[0]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[13].Pt8Line68b_YesNo[0]")
              .uncheck();
          }

          if (user.data.application.publicheck_name == "no") {
            form
              .getCheckBox("form1[0].#subform[13].Pt8Line68b_YesNo[1]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[13].Pt8Line68b_YesNo[1]")
              .uncheck();
          }

          if (user.data.application.inadmissibility_name == "$0-27,000") {
            form.getCheckBox("form1[0].#subform[12].Pt8Line63_CB[0]").check();
          } else {
            form
              .getCheckBox("form1[0].#subform[12].Pt8Line63_CB[0]")
              .uncheck();
          }

          if (
            user.data.application.inadmissibility_name == "$27,001-52,000"
          ) {
            form.getCheckBox("form1[0].#subform[12].Pt8Line63_CB[1]").check();
          } else {
            form
              .getCheckBox("form1[0].#subform[12].Pt8Line63_CB[1]")
              .uncheck();
          }

          if (
            user.data.application.inadmissibility_name == "$52,001-85,000"
          ) {
            form.getCheckBox("form1[0].#subform[12].Pt8Line63_CB[2]").check();
          } else {
            form
              .getCheckBox("form1[0].#subform[12].Pt8Line63_CB[2]")
              .uncheck();
          }

          if (
            user.data.application.inadmissibility_name == "$85,001-141,000"
          ) {
            form.getCheckBox("form1[0].#subform[12].Pt8Line63_CB[3]").check();
          } else {
            form
              .getCheckBox("form1[0].#subform[12].Pt8Line63_CB[3]")
              .uncheck();
          }

          if (user.data.application.inadmissibility_name == "Over $141,000") {
            form.getCheckBox("form1[0].#subform[12].Pt8Line63_CB[4]").check();
          } else {
            form
              .getCheckBox("form1[0].#subform[12].Pt8Line63_CB[4]")
              .uncheck();
          }

          if (user.data.application.inadmissibilityis_name == "$0-18,400") {
            form.getCheckBox("form1[0].#subform[12].Pt8Line64_CB[0]").check();
          } else {
            form
              .getCheckBox("form1[0].#subform[12].Pt8Line64_CB[0]")
              .uncheck();
          }

          if (
            user.data.application.inadmissibilityis_name == "$18,401-136,000"
          ) {
            form.getCheckBox("form1[0].#subform[12].Pt8Line64_CB[1]").check();
          } else {
            form
              .getCheckBox("form1[0].#subform[12].Pt8Line64_CB[1]")
              .uncheck();
          }

          if (
            user.data.application.inadmissibilityis_name == "$136,001-321,400"
          ) {
            form.getCheckBox("form1[0].#subform[12].Pt8Line64_CB[2]").check();
          } else {
            form
              .getCheckBox("form1[0].#subform[12].Pt8Line64_CB[2]")
              .uncheck();
          }

          if (
            user.data.application.inadmissibilityis_name == "$321,401-707,100"
          ) {
            form.getCheckBox("form1[0].#subform[12].Pt8Line64_CB[3]").check();
          } else {
            form
              .getCheckBox("form1[0].#subform[12].Pt8Line64_CB[3]")
              .uncheck();
          }

          if (
            user.data.application.inadmissibilityis_name == "Over $707,100"
          ) {
            form.getCheckBox("form1[0].#subform[12].Pt8Line64_CB[4]").check();
          } else {
            form
              .getCheckBox("form1[0].#subform[12].Pt8Line64_CB[4]")
              .uncheck();
          }

          if (
            user.data.application.inadmissibilitysa_name ==
            "Grades 1 through 11"
          ) {
            form.getCheckBox("form1[0].#subform[13].Pt8Line66_CB[0]").check();
          } else {
            form
              .getCheckBox("form1[0].#subform[13].Pt8Line66_CB[0]")
              .uncheck();
          }

          if (
            user.data.application.inadmissibilitysa_name ==
            "12th grade - no diploma"
          ) {
            form.getCheckBox("form1[0].#subform[13].Pt8Line66_CB[1]").check();
          } else {
            form
              .getCheckBox("form1[0].#subform[13].Pt8Line66_CB[1]")
              .uncheck();
          }

          if (
            user.data.application.inadmissibilitysa_name ==
            "High school diploma, GED, or alternative credential"
          ) {
            form.getCheckBox("form1[0].#subform[13].Pt8Line66_CB[2]").check();
          } else {
            form
              .getCheckBox("form1[0].#subform[13].Pt8Line66_CB[2]")
              .uncheck();
          }

          if (
            user.data.application.inadmissibilitysa_name ==
            "1 or more years of college credit, no degree"
          ) {
            form.getCheckBox("form1[0].#subform[13].Pt8Line66_CB[3]").check();
          } else {
            form
              .getCheckBox("form1[0].#subform[13].Pt8Line66_CB[3]")
              .uncheck();
          }

          if (
            user.data.application.inadmissibilitysa_name ==
            "Associates degree"
          ) {
            form.getCheckBox("form1[0].#subform[13].Pt8Line66_CB[4]").check();
          } else {
            form
              .getCheckBox("form1[0].#subform[13].Pt8Line66_CB[4]")
              .uncheck();
          }

          if (
            user.data.application.inadmissibilitysa_name == "Bachelors degree"
          ) {
            form.getCheckBox("form1[0].#subform[13].Pt8Line66_CB[5]").check();
          } else {
            form
              .getCheckBox("form1[0].#subform[13].Pt8Line66_CB[5]")
              .uncheck();
          }

          if (
            user.data.application.inadmissibilitysa_name == "Masters degree"
          ) {
            form.getCheckBox("form1[0].#subform[13].Pt8Line66_CB[6]").check();
          } else {
            form
              .getCheckBox("form1[0].#subform[13].Pt8Line66_CB[6]")
              .uncheck();
          }

          if (
            user.data.application.inadmissibilitysa_name ==
            "Professional degree (JD, MD, DMD, etc.)"
          ) {
            form.getCheckBox("form1[0].#subform[13].Pt8Line66_CB[7]").check();
          } else {
            form
              .getCheckBox("form1[0].#subform[13].Pt8Line66_CB[7]")
              .uncheck();
          }

          if (
            user.data.application.inadmissibilitysa_name == "Doctorate degree"
          ) {
            form.getCheckBox("form1[0].#subform[13].Pt8Line66_CB[8]").check();
          } else {
            form
              .getCheckBox("form1[0].#subform[13].Pt8Line66_CB[8]")
              .uncheck();
          }

          // if (Array.isArray(user.data.application.certificates_names)) {
          //   console.log(user.data.application.certificates_names);
          //   if (user.data.application.certificates_names.length) {
          //     if (user.data.application.certificates_names[0].certificates_name) {
          //       form.getTextField('form1[0].#subform[13].Pt8Line67_Row1[0]').setText(user.data.application.certificates_names[0].certificates_name?.toUpperCase());
          //     }

          //   }

          // }

          if (Array.isArray(user.data.application.certificates_names)) {
            console.log(user.data.application.certificates_names);
            for (
              let i = 0;
              i < user.data.application.certificates_names.length;
              i++
            ) {
              const certificateName =
                user.data.application.certificates_names[i]
                  ?.certificates_name;
              if (certificateName) {
                form
                  .getTextField(
                    `form1[0].#subform[13].Pt8Line67_Row${i + 1}[0]`
                  )
                  .setText(certificateName.toUpperCase());
              }
            }
          }

          // Country of citizenship or nationality

          // if (Array.isArray(user.data.application.certificates_names)) {
          // 	if (user.data.application.country_names.length) {
          // 		form.getTextField('form1[0].#subform[1].Pt1Line9_CountryofCitizenship[0]').setText(user.data.application.country_names[0].country_name?.toUpperCase());
          // 	}
          // }

          if (Array.isArray(user.data.application.country_names)) {
            if (user.data.application.country_names.length) {
              form
                .getTextField(
                  "form1[0].#subform[1].Pt1Line9_CountryofCitizenship[0]"
                )
                .setText(
                  user.data.application.country_names[0].country_name?.slice(
                    0,
                    20
                  )
                );
            }
          }

          // AlienNumber
          if (user.data.application.usregistrationnumber_name) {
            form
              .getTextField("form1[0].#subform[0].Pt1Line10_AlienNumber[0]")
              .setText(user.data.application.usregistrationnumber_name);
          }

          if (user.data.application.usregistrationnumber_name) {
            form
              .getTextField("form1[0].#subform[1].Pt1Line10_AlienNumber[1]")
              .setText(user.data.application.usregistrationnumber_name);
          }

          if (user.data.application.usregistrationnumber_name) {
            form
              .getTextField("form1[0].#subform[1].Pt1Line10_AlienNumber[2]")
              .setText(user.data.application.usregistrationnumber_name);
          }

          if (user.data.application.usregistrationnumber_name) {
            form
              .getTextField("form1[0].#subform[2].Pt1Line10_AlienNumber[3]")
              .setText(user.data.application.usregistrationnumber_name);
          }

          if (user.data.application.usregistrationnumber_name) {
            form
              .getTextField("form1[0].#subform[3].Pt1Line10_AlienNumber[4]")
              .setText(user.data.application.usregistrationnumber_name);
          }

          if (user.data.application.usregistrationnumber_name) {
            form
              .getTextField("form1[0].#subform[4].Pt1Line10_AlienNumber[5]")
              .setText(user.data.application.usregistrationnumber_name);
          }

          if (user.data.application.usregistrationnumber_name) {
            form
              .getTextField("form1[0].#subform[5].Pt1Line10_AlienNumber[6]")
              .setText(user.data.application.usregistrationnumber_name);
          }

          if (user.data.application.usregistrationnumber_name) {
            form
              .getTextField("form1[0].#subform[6].Pt1Line10_AlienNumber[7]")
              .setText(user.data.application.usregistrationnumber_name);
          }

          if (user.data.application.usregistrationnumber_name) {
            form
              .getTextField("form1[0].#subform[7].Pt1Line10_AlienNumber[8]")
              .setText(user.data.application.usregistrationnumber_name);
          }

          if (user.data.application.usregistrationnumber_name) {
            form
              .getTextField("form1[0].#subform[8].Pt1Line10_AlienNumber[9]")
              .setText(user.data.application.usregistrationnumber_name);
          }

          if (user.data.application.usregistrationnumber_name) {
            form
              .getTextField("form1[0].#subform[9].Pt1Line10_AlienNumber[10]")
              .setText(user.data.application.usregistrationnumber_name);
          }

          if (user.data.application.usregistrationnumber_name) {
            form
              .getTextField("form1[0].#subform[10].Pt1Line10_AlienNumber[11]")
              .setText(user.data.application.usregistrationnumber_name);
          }

          if (user.data.application.usregistrationnumber_name) {
            form
              .getTextField("form1[0].#subform[11].Pt1Line10_AlienNumber[12]")
              .setText(user.data.application.usregistrationnumber_name);
          }

          if (user.data.application.usregistrationnumber_name) {
            form
              .getTextField("form1[0].#subform[12].Pt1Line10_AlienNumber[13]")
              .setText(user.data.application.usregistrationnumber_name);
          }

          if (user.data.application.usregistrationnumber_name) {
            form
              .getTextField("form1[0].#subform[13].Pt1Line10_AlienNumber[14]")
              .setText(user.data.application.usregistrationnumber_name);
          }

          if (user.data.application.usregistrationnumber_name) {
            form
              .getTextField("form1[0].#subform[14].Pt1Line10_AlienNumber[15]")
              .setText(user.data.application.usregistrationnumber_name);
          }

          if (user.data.application.usregistrationnumber_name) {
            form
              .getTextField("form1[0].#subform[15].Pt1Line10_AlienNumber[16]")
              .setText(user.data.application.usregistrationnumber_name);
          }

          if (user.data.application.usregistrationnumber_name) {
            form
              .getTextField("form1[0].#subform[16].Pt1Line10_AlienNumber[17]")
              .setText(user.data.application.usregistrationnumber_name);
          }

          if (user.data.application.usregistrationnumber_name) {
            form
              .getTextField("form1[0].#subform[17].Pt1Line10_AlienNumber[18]")
              .setText(user.data.application.usregistrationnumber_name);
          }

          if (user.data.application.usregistrationnumber_name) {
            form
              .getTextField("form1[0].#subform[18].Pt1Line10_AlienNumber[19]")
              .setText(user.data.application.usregistrationnumber_name);
          }

          // Hfs the Social

          // if (user.data.application.administration_name == 'no') {
          //   form.getCheckBox('form1[0].#subform[1].Pt1Line14_YN[0]').check();
          // } else {
          //   form.getCheckBox('form1[0].#subform[1].Pt1Line14_YN[0]').uncheck();
          // }
          // if (user.data.application.administration_name == 'yes') {
          //   form.getCheckBox('form1[0].#subform[1].Pt1Line14_YN[1]').check();
          // } else {
          //   form.getCheckBox('form1[0].#subform[1].Pt1Line14_YN[1]').uncheck();
          // }

          // // SSA

          // if (user.data.application.consentfordisclosure_name == 'no') {
          //   form.getCheckBox('form1[0].#subform[1].Pt1Line15_YN[0]').check();
          // } else {
          //   form.getCheckBox('form1[0].#subform[1].Pt1Line15_YN[0]').uncheck();
          // }
          // if (user.data.application.consentfordisclosure_name == 'yes') {
          //   form.getCheckBox('form1[0].#subform[1].Pt1Line15_YN[1]').check();
          // } else {
          //   form.getCheckBox('form1[0].#subform[1].Pt1Line15_YN[1]').uncheck();
          // }

          // // Consent

          // if (user.data.application.applicationforus_name == 'no') {
          //   form.getCheckBox('form1[0].#subform[1].Pt1Line16_YN[0]').check();
          // } else {
          //   form.getCheckBox('form1[0].#subform[1].Pt1Line16_YN[0]').uncheck();
          // }
          // if (user.data.application.applicationforus_name == 'yes') {
          //   form.getCheckBox('form1[0].#subform[1].Pt1Line16_YN[1]').check();
          // } else {
          //   form.getCheckBox('form1[0].#subform[1].Pt1Line16_YN[1]').uncheck();
          // }

          // No for every question from

          if (user.data.application.name) {
            form
              .getCheckBox("form1[0].#subform[9].Pt8Line14_YesNo[0]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[9].Pt8Line14_YesNo[0]")
              .uncheck();
          }

          // form1[0].#subform[9].Pt8Line14_YesNo[0]

          if (user.data.application.name) {
            form
              .getCheckBox("form1[0].#subform[9].Pt8Line15_YesNo[1]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[9].Pt8Line15_YesNo[1]")
              .uncheck();
          }

          // form1[0].#subform[9].Pt8Line15_YesNo[0]

          if (user.data.application.name) {
            form
              .getCheckBox("form1[0].#subform[9].Pt8Line16_YesNo[0]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[9].Pt8Line16_YesNo[0]")
              .uncheck();
          }

          // form1[0].#subform[9].Pt8Line16_YesNo[0]

          if (user.data.application.name) {
            form
              .getCheckBox("form1[0].#subform[9].Pt8Line17_YesNo[0]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[9].Pt8Line17_YesNo[0]")
              .uncheck();
          }

          // form1[0].#subform[9].Pt8Line17_YesNo[0]

          if (user.data.application.name) {
            form
              .getCheckBox("form1[0].#subform[9].Pt8Line18_YesNo[1]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[9].Pt8Line18_YesNo[1]")
              .uncheck();
          }

          // form1[0].#subform[9].Pt8Line18_YesNo[0]

          if (user.data.application.name) {
            form
              .getCheckBox("form1[0].#subform[9].Pt8Line20_YesNo[1]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[9].Pt8Line20_YesNo[1]")
              .uncheck();
          }
          // form1[0].#subform[9].Pt8Line20_YesNo[0]

          if (user.data.application.name) {
            form
              .getCheckBox("form1[0].#subform[9].Pt8Line21_YesNo[0]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[9].Pt8Line21_YesNo[0]")
              .uncheck();
          }
          // form1[0].#subform[9].Pt8Line21_YesNo[0]

          if (user.data.application.name) {
            form
              .getCheckBox("form1[0].#subform[9].Pt8Line22_YesNo[1]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[9].Pt8Line22_YesNo[1]")
              .uncheck();
          }
          // form1[0].#subform[9].Pt8Line22_YesNo[0]

          if (user.data.application.name) {
            form
              .getCheckBox("form1[0].#subform[9].Pt8Line23_YesNo[0]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[9].Pt8Line23_YesNo[0]")
              .uncheck();
          }
          // form1[0].#subform[9].Pt8Line23_YesNo[0]

          if (user.data.application.name) {
            form
              .getCheckBox("form1[0].#subform[9].Pt8Line24a_YesNo[1]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[9].Pt8Line24a_YesNo[1]")
              .uncheck();
          }

          // form1[0].#subform[9].Pt8Line24a_YesNo[0]

          // form1[0].#subform[9].Pt8Line24b_YesNo[0]
          // form1[0].#subform[9].Pt8Line24b_YesNo[1]

          if (user.data.application.name) {
            form
              .getCheckBox("form1[0].#subform[9].Pt8Line19_YesNo[0]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[9].Pt8Line19_YesNo[0]")
              .uncheck();
          }

          // form1[0].#subform[9].Pt8Line19_YesNo[0]

          if (user.data.application.name) {
            form
              .getCheckBox("form1[0].#subform[9].Pt8Line26_YesNo[0]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[9].Pt8Line26_YesNo[0]")
              .uncheck();
          }
          // form1[0].#subform[9].Pt8Line26_YesNo[0]

          if (user.data.application.name) {
            form
              .getCheckBox("form1[0].#subform[9].Pt8Line25_YesNo[1]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[9].Pt8Line25_YesNo[1]")
              .uncheck();
          }
          // form1[0].#subform[9].Pt8Line25_YesNo[0]

          if (user.data.application.name) {
            form
              .getCheckBox("form1[0].#subform[10].Pt8Line27_YesNo[1]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[10].Pt8Line27_YesNo[1]")
              .uncheck();
          }
          // form1[0].#subform[9].Pt8Line27_YesNo[0]

          if (user.data.application.name) {
            form
              .getCheckBox("form1[0].#subform[10].Pt8Line28_YesNo[0]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[10].Pt8Line28_YesNo[0]")
              .uncheck();
          }
          // form1[0].#subform[9].Pt8Line28_YesNo[0]

          if (user.data.application.name) {
            form
              .getCheckBox("form1[0].#subform[10].Pt8Line29_YesNo[1]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[10].Pt8Line29_YesNo[1]")
              .uncheck();
          }

          // form1[0].#subform[9].Pt8Line29_YesNo[0]

          // form1[0].#subform[9].Pt8Line24c_YesNo[0]
          // form1[0].#subform[9].Pt8Line24c_YesNo[1]

          if (user.data.application.name) {
            form
              .getCheckBox("form1[0].#subform[10].Pt8Line30_YesNo[0]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[10].Pt8Line30_YesNo[0]")
              .uncheck();
          }
          // form1[0].#subform[9].Pt8Line30_YesNo[0]

          if (user.data.application.name) {
            form
              .getCheckBox("form1[0].#subform[10].Pt8Line32_YesNo[1]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[10].Pt8Line32_YesNo[1]")
              .uncheck();
          }
          // form1[0].#subform[10].Pt8Line32_YesNo[0]

          if (user.data.application.name) {
            form
              .getCheckBox("form1[0].#subform[10].Pt8Line33_YesNo[0]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[10].Pt8Line33_YesNo[0]")
              .uncheck();
          }
          // form1[0].#subform[10].Pt8Line33_YesNo[0]

          if (user.data.application.name) {
            form
              .getCheckBox("form1[0].#subform[10].Pt8Line34_YesNo[0]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[10].Pt8Line34_YesNo[0]")
              .uncheck();
          }

          // form1[0].#subform[10].Pt8Line34_YesNo[0]

          if (user.data.application.name) {
            form
              .getCheckBox("form1[0].#subform[10].Pt8Line35_YesNo[0]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[10].Pt8Line35_YesNo[0]")
              .uncheck();
          }
          // form1[0].#subform[10].Pt8Line35_YesNo[0]

          if (user.data.application.name) {
            form
              .getCheckBox("form1[0].#subform[10].Pt8Line36_YesNo[1]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[10].Pt8Line36_YesNo[1]")
              .uncheck();
          }

          // form1[0].#subform[10].Pt8Line36_YesNo[0]

          if (user.data.application.name) {
            form
              .getCheckBox("form1[0].#subform[10].Pt8Line37_YesNo[0]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[10].Pt8Line37_YesNo[0]")
              .uncheck();
          }

          // form1[0].#subform[10].Pt8Line37_YesNo[0]

          if (user.data.application.name) {
            form
              .getCheckBox("form1[0].#subform[10].Pt8Line38_YesNo[1]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[10].Pt8Line38_YesNo[1]")
              .uncheck();
          }
          // form1[0].#subform[10].Pt8Line38_YesNo[0]

          if (user.data.application.name) {
            form
              .getCheckBox("form1[0].#subform[10].Pt8Line39_YesNo[0]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[10].Pt8Line39_YesNo[0]")
              .uncheck();
          }
          // form1[0].#subform[10].Pt8Line39_YesNo[0]

          if (user.data.application.name) {
            form
              .getCheckBox("form1[0].#subform[10].Pt8Line42_YesNo[0]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[10].Pt8Line42_YesNo[0]")
              .uncheck();
          }
          // form1[0].#subform[10].Pt8Line42_YesNo[0]

          if (user.data.application.name) {
            form
              .getCheckBox("form1[0].#subform[10].Pt8Line43_YesNo[1]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[10].Pt8Line43_YesNo[1]")
              .uncheck();
          }
          // form1[0].#subform[10].Pt8Line43_YesNo[0]

          if (user.data.application.name) {
            form
              .getCheckBox("form1[0].#subform[10].Pt8Line44_YesNo[0]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[10].Pt8Line44_YesNo[0]")
              .uncheck();
          }
          // form1[0].#subform[10].Pt8Line44_YesNo[0]

          if (user.data.application.name) {
            form
              .getCheckBox("form1[0].#subform[10].Pt8Line45_YesNo[1]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[10].Pt8Line45_YesNo[1]")
              .uncheck();
          }

          // form1[0].#subform[10].Pt8Line45_YesNo[0]

          if (user.data.application.name) {
            form
              .getCheckBox("form1[0].#subform[11].Pt8Line46a_YesNo[1]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[11].Pt8Line46a_YesNo[1]")
              .uncheck();
          }

          // form1[0].#subform[10].Pt8Line46a_YesNo[0]

          if (user.data.application.name) {
            form
              .getCheckBox("form1[0].#subform[11].Pt8Line46b_YesNo[0]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[11].Pt8Line46b_YesNo[0]")
              .uncheck();
          }

          // form1[0].#subform[10].Pt8Line46b_YesNo[0]

          if (user.data.application.name) {
            form
              .getCheckBox("form1[0].#subform[11].Pt8Line46c_YesNo[0]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[11].Pt8Line46c_YesNo[0]")
              .uncheck();
          }
          // form1[0].#subform[10].Pt8Line46c_YesNo[0]

          if (user.data.application.name) {
            form
              .getCheckBox("form1[0].#subform[11].Pt8Line46d_YesNo[0]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[11].Pt8Line46d_YesNo[0]")
              .uncheck();
          }
          // form1[0].#subform[10].Pt8Line46d_YesNo[0]

          if (user.data.application.name) {
            form
              .getCheckBox("form1[0].#subform[10].Pt8Line40_YesNo[1]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[10].Pt8Line40_YesNo[1]")
              .uncheck();
          }

          // form1[0].#subform[10].Pt8Line40_YesNo[0]

          if (user.data.application.name) {
            form
              .getCheckBox("form1[0].#subform[11].Pt8Line46e_YesNo[1]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[11].Pt8Line46e_YesNo[1]")
              .uncheck();
          }
          // form1[0].#subform[10].Pt8Line46e_YesNo[0]

          if (user.data.application.name) {
            form
              .getCheckBox("form1[0].#subform[10].Pt8Line31_YesNo[0]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[10].Pt8Line31_YesNo[0]")
              .uncheck();
          }
          // form1[0].#subform[10].Pt8Line31_YesNo[0]

          if (user.data.application.name) {
            form
              .getCheckBox("form1[0].#subform[10].Pt8Line41_YesNo[0]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[10].Pt8Line41_YesNo[0]")
              .uncheck();
          }
          // form1[0].#subform[10].Pt8Line41_YesNo[0]

          if (user.data.application.name) {
            form
              .getCheckBox("form1[0].#subform[11].Pt8Line47_YesNo[0]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[11].Pt8Line47_YesNo[0]")
              .uncheck();
          }

          // form1[0].#subform[10].Pt8Line47_YesNo[0]

          if (user.data.application.name) {
            form
              .getCheckBox("form1[0].#subform[11].Pt8Line48a_YesNo[0]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[11].Pt8Line48a_YesNo[0]")
              .uncheck();
          }
          // form1[0].#subform[11].Pt8Line48a_YesNo[0]

          if (user.data.application.name) {
            form
              .getCheckBox("form1[0].#subform[11].Pt8Line48b_YesNo[1]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[11].Pt8Line48b_YesNo[1]")
              .uncheck();
          }

          // form1[0].#subform[11].Pt8Line48b_YesNo[0]

          if (user.data.application.name) {
            form
              .getCheckBox("form1[0].#subform[11].Pt8Line49_YesNo[0]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[11].Pt8Line49_YesNo[0]")
              .uncheck();
          }

          // form1[0].#subform[11].Pt8Line49_YesNo[0]

          if (user.data.application.name) {
            form
              .getCheckBox("form1[0].#subform[11].Pt8Line48c_YesNo[1]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[11].Pt8Line48c_YesNo[1]")
              .uncheck();
          }
          // form1[0].#subform[11].Pt8Line48c_YesNo[0]

          if (user.data.application.name) {
            form
              .getCheckBox("form1[0].#subform[11].Pt8Line48d_YesNo[0]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[11].Pt8Line48d_YesNo[0]")
              .uncheck();
          }
          // form1[0].#subform[11].Pt8Line48d_YesNo[0]

          if (user.data.application.name) {
            form
              .getCheckBox("form1[0].#subform[11].Pt8Line50_YesNo[1]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[11].Pt8Line50_YesNo[1]")
              .uncheck();
          }
          // form1[0].#subform[11].Pt8Line50_YesNo[0]

          if (user.data.application.name) {
            form
              .getCheckBox("form1[0].#subform[11].Pt8Line48e_YesNo[0]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[11].Pt8Line48e_YesNo[0]")
              .uncheck();
          }

          // form1[0].#subform[11].Pt8Line48e_YesNo[0]

          if (user.data.application.name) {
            form
              .getCheckBox("form1[0].#subform[11].Pt8Line51a_YesNo[0]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[11].Pt8Line51a_YesNo[0]")
              .uncheck();
          }
          // form1[0].#subform[11].Pt8Line51a_YesNo[0]

          if (user.data.application.name) {
            form
              .getCheckBox("form1[0].#subform[11].Pt8Line51d_YesNo[0]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[11].Pt8Line51d_YesNo[0]")
              .uncheck();
          }
          // form1[0].#subform[11].Pt8Line51d_YesNo[0]

          if (user.data.application.name) {
            form
              .getCheckBox("form1[0].#subform[11].Pt8Line51e_YesNo[0]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[11].Pt8Line51e_YesNo[0]")
              .uncheck();
          }
          // form1[0].#subform[11].Pt8Line51e_YesNo[0]

          if (user.data.application.name) {
            form
              .getCheckBox("form1[0].#subform[11].Pt8Line51f_YesNo[0]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[11].Pt8Line51f_YesNo[0]")
              .uncheck();
          }
          // form1[0].#subform[11].Pt8Line51f_YesNo[0]

          if (user.data.application.name) {
            form
              .getCheckBox("form1[0].#subform[12].Pt8Line53_YesNo[0]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[12].Pt8Line53_YesNo[0]")
              .uncheck();
          }
          // form1[0].#subform[11].Pt8Line53_YesNo[0]

          // if (user.data.application.name) {
          //   form.getCheckBox('form1[0].#subform[12].Pt8Line52_YesNo[1]').check();
          // } else {
          //   1
          //   form.getCheckBox('form1[0].#subform[12].Pt8Line52_YesNo[1]').uncheck();
          // }

          // form1[0].#subform[11].Pt8Line52_YesNo[0]

          if (user.data.application.name) {
            form
              .getCheckBox("form1[0].#subform[12].Pt8Line54_YesNo[1]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[12].Pt8Line54_YesNo[1]")
              .uncheck();
          }
          // form1[0].#subform[11].Pt8Line54_YesNo[0]

          if (user.data.application.name) {
            form
              .getCheckBox("form1[0].#subform[12].Pt8Line55_YesNo[0]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[12].Pt8Line55_YesNo[0]")
              .uncheck();
          }
          // form1[0].#subform[11].Pt8Line55_YesNo[0]

          if (user.data.application.name) {
            form
              .getCheckBox("form1[0].#subform[12].Pt8Line56_YesNo[0]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[12].Pt8Line56_YesNo[0]")
              .uncheck();
          }

          // form1[0].#subform[11].Pt8Line56_YesNo[0]

          if (user.data.application.name) {
            form
              .getCheckBox("form1[0].#subform[11].Pt8Line51b_YesNo[0]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[11].Pt8Line51b_YesNo[0]")
              .uncheck();
          }

          // form1[0].#subform[11].Pt8Line51b_YesNo[0]

          if (user.data.application.name) {
            form
              .getCheckBox("form1[0].#subform[11].Pt8Line51c_YesNo[0]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[11].Pt8Line51c_YesNo[0]")
              .uncheck();
          }
          // form1[0].#subform[11].Pt8Line51c_YesNo[0]

          if (user.data.application.name) {
            form
              .getCheckBox("form1[0].#subform[12].Pt8Line57_YesNo[1]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[12].Pt8Line57_YesNo[1]")
              .uncheck();
          }
          // form1[0].#subform[11].Pt8Line57_YesNo[0]

          if (user.data.application.name) {
            form
              .getCheckBox("form1[0].#subform[12].Pt8Line58a_YesNo[0]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[12].Pt8Line58a_YesNo[0]")
              .uncheck();
          }
          // form1[0].#subform[12].Pt8Line58a_YesNo[0]

          if (user.data.application.name) {
            form
              .getCheckBox("form1[0].#subform[12].Pt8Line58b_YesNo[1]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[12].Pt8Line58b_YesNo[1]")
              .uncheck();
          }
          // form1[0].#subform[12].Pt8Line58b_YesNo[0]

          if (user.data.application.name) {
            form
              .getCheckBox("form1[0].#subform[12].Pt8Line58c_YesNo[0]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[12].Pt8Line58c_YesNo[0]")
              .uncheck();
          }
          // form1[0].#subform[12].Pt8Line58c_YesNo[0]

          if (user.data.application.name) {
            form
              .getCheckBox("form1[0].#subform[12].Pt8Line58d_YesNo[0]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[12].Pt8Line58d_YesNo[0]")
              .uncheck();
          }
          // form1[0].#subform[12].Pt8Line58d_YesNo[0]

          if (user.data.application.name) {
            form
              .getCheckBox("form1[0].#subform[12].Pt8Line58e_YesNo[1]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[12].Pt8Line58e_YesNo[1]")
              .uncheck();
          }

          // form1[0].#subform[12].Pt8Line58e_YesNo[0]

          if (user.data.application.name) {
            form
              .getCheckBox("form1[0].#subform[12].Pt8Line59_YesNo[1]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[12].Pt8Line59_YesNo[1]")
              .uncheck();
          }

          // form1[0].#subform[12].Pt8Line59_YesNo[0]

          if (user.data.application.name) {
            form
              .getCheckBox("form1[0].#subform[12].Pt8Line60_YesNo[0]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[12].Pt8Line60_YesNo[0]")
              .uncheck();
          }

          // form1[0].#subform[12].Pt8Line60_YesNo[0]

          // if (user.data.application.name) {
          //   form.getCheckBox('form1[0].#subform[12].Pt8Line64_YesNo[1]').check();
          // } else {
          //   form.getCheckBox('form1[0].#subform[12].Pt8Line64_YesNo[1]').uncheck();
          // }

          // form1[0].#subform[12].Pt8Line64_YesNo[0]

          // if (user.data.application.name) {
          //   form.getCheckBox('form1[0].#subform[12].Pt8Line65_YesNo[0]').check();
          // } else {
          //   form.getCheckBox('form1[0].#subform[12].Pt8Line65_YesNo[0]').uncheck();
          // }

          // form1[0].#subform[12].Pt8Line65_YesNo[0]

          // if (user.data.application.name) {
          //   form.getCheckBox('form1[0].#subform[12].Pt8Line66_YesNo[1]').check();
          // } else {
          //   form.getCheckBox('form1[0].#subform[12].Pt8Line66_YesNo[1]').uncheck();
          // }

          // form1[0].#subform[12].Pt8Line66_YesNo[0]

          // if (user.data.application.name) {
          //   form.getCheckBox('form1[0].#subform[13].Pt8Line68_YesNo[1]').check();
          // } else {
          //   form.getCheckBox('form1[0].#subform[13].Pt8Line68_YesNo[1]').uncheck();
          // }

          // form1[0].#subform[12].Pt8Line68_YesNo[0]

          // if (user.data.application.name) {
          //   form.getCheckBox('form1[0].#subform[12].Pt8Line67_YesNo[0]').check();
          // } else {
          //   form.getCheckBox('form1[0].#subform[12].Pt8Line67_YesNo[0]').uncheck();
          // }
          // form1[0].#subform[12].Pt8Line67_YesNo[0]

          if (user.data.application.name) {
            form
              .getCheckBox("form1[0].#subform[14].Pt8Line80_YesNo[1]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[14].Pt8Line80_YesNo[1]")
              .uncheck();
          }

          if (user.data.application.name) {
            form
              .getCheckBox("form1[0].#subform[14].Pt8Line81_YesNo[0]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[14].Pt8Line81_YesNo[0]")
              .uncheck();
          }

          if (user.data.application.name) {
            form
              .getCheckBox("form1[0].#subform[14].Pt8Line82_YesNo[1]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[14].Pt8Line82_YesNo[1]")
              .uncheck();
          }

          if (user.data.application.name) {
            form
              .getCheckBox("form1[0].#subform[14].Pt8Line83_YesNo[0]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[14].Pt8Line83_YesNo[0]")
              .uncheck();
          }

          if (user.data.application.name) {
            form
              .getCheckBox("form1[0].#subform[14].Pt8Line84_YesNo[1]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[14].Pt8Line84_YesNo[1]")
              .uncheck();
          }

          if (user.data.application.name) {
            form
              .getCheckBox("form1[0].#subform[14].Pt8Line85a_YesNo[0]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[14].Pt8Line85a_YesNo[0]")
              .uncheck();
          }

          if (user.data.application.name) {
            form
              .getCheckBox("form1[0].#subform[15].Pt8Line85b_YesNo[0]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[15].Pt8Line85b_YesNo[0]")
              .uncheck();
          }

          if (user.data.application.name) {
            form
              .getCheckBox("form1[0].#subform[15].Pt8Line85c_YesNo[0]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[15].Pt8Line85c_YesNo[0]")
              .uncheck();
          }

          if (user.data.application.name) {
            form
              .getCheckBox("form1[0].#subform[15].Pt8Line86a_YesNo[0]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[15].Pt8Line86a_YesNo[0]")
              .uncheck();
          }

          if (user.data.application.name) {
            form
              .getCheckBox("form1[0].#subform[14].Pt8Line69b_YesNo[1]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[14].Pt8Line69b_YesNo[1]")
              .uncheck();
          }

          if (user.data.application.name) {
            form
              .getCheckBox("form1[0].#subform[14].Pt8Line69a_YesNo[0]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[14].Pt8Line69a_YesNo[0]")
              .uncheck();
          }

          // form1[0].#subform[12].Pt8Line69_YesNo[0]

          // if (user.data.application.name) {
          //   form.getCheckBox('form1[0].#subform[12].Pt8Line61_YesNo[1]').check();
          // } else {
          //   form.getCheckBox('form1[0].#subform[12].Pt8Line61_YesNo[1]').uncheck();
          // }

          // form1[0].#subform[12].Pt8Line61_YesNo[0]

          // if (user.data.application.name) {
          //   form.getCheckBox('form1[0].#subform[12].Pt8Line62_YesNo[1]').check();
          // } else {
          //   form.getCheckBox('form1[0].#subform[12].Pt8Line62_YesNo[1]').uncheck();
          // }

          // form1[0].#subform[12].Pt8Line62_YesNo[0]

          if (user.data.application.name) {
            form
              .getCheckBox("form1[0].#subform[14].Pt8Line72_YesNo[1]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[14].Pt8Line72_YesNo[1]")
              .uncheck();
          }

          // form1[0].#subform[12].Pt8Line72a_YesNo[0]

          // if (user.data.application.name) {
          //   form.getCheckBox('form1[0].#subform[14].Pt8Line72_YesNo[0]').check();
          // } else {
          //   form.getCheckBox('form1[0].#subform[14].Pt8Line72_YesNo[0]').uncheck();
          // }

          // form1[0].#subform[12].Pt8Line72b_YesNo[0]

          if (user.data.application.name) {
            form
              .getCheckBox("form1[0].#subform[14].Pt8Line70_YesNo[1]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[14].Pt8Line70_YesNo[1]")
              .uncheck();
          }

          // form1[0].#subform[12].Pt8Line70_YesNo[0]

          if (user.data.application.name) {
            form
              .getCheckBox("form1[0].#subform[14].Pt8Line71_YesNo[0]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[14].Pt8Line71_YesNo[0]")
              .uncheck();
          }

          // form1[0].#subform[12].Pt8Line71_YesNo[0]

          // if (user.data.application.name) {
          //   form.getCheckBox('form1[0].#subform[12].Pt8Line63_YesNo[0]').check();
          // } else {
          //   form.getCheckBox('form1[0].#subform[12].Pt8Line63_YesNo[0]').uncheck();
          // }

          // form1[0].#subform[12].Pt8Line63_YesNo[0]
          // form1[0].#subform[12].Pt8Line63b_YesNo[0]
          // form1[0].#subform[12].Pt8Line63b_YesNo[1]

          if (user.data.application.name) {
            form
              .getCheckBox("form1[0].#subform[14].Pt8Line73_YesNo[0]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[14].Pt8Line73_YesNo[0]")
              .uncheck();
          }

          // form1[0].#subform[13].Pt8Line73a_YesNo[0]

          if (user.data.application.name) {
            form
              .getCheckBox("form1[0].#subform[14].Pt8Line73_YesNo[0]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[14].Pt8Line73_YesNo[0]")
              .uncheck();
          }

          // form1[0].#subform[13].Pt8Line73b_YesNo[0]

          if (user.data.application.name) {
            form
              .getCheckBox("form1[0].#subform[14].Pt8Line74_YesNo[1]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[14].Pt8Line74_YesNo[1]")
              .uncheck();
          }

          // form1[0].#subform[13].Pt8Line74_YesNo[0]

          if (user.data.application.name) {
            form
              .getCheckBox("form1[0].#subform[14].Pt8Line75_YesNo[0]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[14].Pt8Line75_YesNo[0]")
              .uncheck();
          }

          // form1[0].#subform[13].Pt8Line75_YesNo[0]

          if (user.data.application.name) {
            form
              .getCheckBox("form1[0].#subform[14].Pt8Line76_YesNo[0]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[14].Pt8Line76_YesNo[0]")
              .uncheck();
          }

          // form1[0].#subform[13].Pt8Line76_YesNo[0]

          // if(user.data.application.name){
          // 	form.getCheckBox('form1[0].#subform[14].Pt9Line1_YesNo[1]').check();
          // }else{
          // 	form.getCheckBox('form1[0].#subform[14].Pt9Line1_YesNo[1]').uncheck();
          // }

          // // form1[0].#subform[13].Pt9Line1_YesNo[0]

          if (user.data.application.name) {
            form
              .getCheckBox("form1[0].#subform[14].Pt8Line77_YesNo[1]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[14].Pt8Line77_YesNo[1]")
              .uncheck();
          }

          // form1[0].#subform[13].Pt8Line77_YesNo[0]

          if (user.data.application.name) {
            form
              .getCheckBox("form1[0].#subform[14].Pt8Line78b_YesNo[1]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[14].Pt8Line78b_YesNo[1]")
              .uncheck();
          }

          if (user.data.application.name) {
            form
              .getCheckBox("form1[0].#subform[14].Pt8Line78a_YesNo[0]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[14].Pt8Line78a_YesNo[0]")
              .uncheck();
          }

          // form1[0].#subform[13].Pt8Line78_YesNo[0]

          if (user.data.application.name) {
            form
              .getCheckBox("form1[0].#subform[14].Pt8Line79a_YesNo[0]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[14].Pt8Line79a_YesNo[0]")
              .uncheck();
          }

          // form1[0].#subform[13].Pt8Line79a_YesNo[0]

          if (user.data.application.name) {
            form
              .getCheckBox("form1[0].#subform[14].Pt8Line79b_YesNo[0]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[14].Pt8Line79b_YesNo[0]")
              .uncheck();
          }

          // form1[0].#subform[13].Pt8Line79b_YesNo[0]

          // if (user.data.application.name) {
          //   form.getCheckBox('form1[0].#subform[14].Pt8Line79c_YesNo[0]').check();
          // } else {
          //   form.getCheckBox('form1[0].#subform[14].Pt8Line79c_YesNo[0]').uncheck();
          // }

          // form1[0].#subform[13].Pt8Line79c_YesNo[0]

          if (user.data.application.name) {
            form
              .getCheckBox("form1[0].#subform[14].Pt8Line80_YesNo[1]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[14].Pt8Line80_YesNo[1]")
              .uncheck();
          }

          // form1[0].#subform[13].Pt8Line80a_YesNo[0]

          // Address

          //   if(user.data.application.insideusifany_name=='90'){
          //   	form.getCheckBox('form1[0].#subform[3].Pt3Line5_Unit[0]').check();
          //   }else{
          //   	form.getCheckBox('form1[0].#subform[3].Pt3Line5_Unit[0]').uncheck();
          //   }

          //   if(user.data.application.insideusifany_name=='91'){
          //   	form.getCheckBox('form1[0].#subform[3].Pt3Line5_Unit[1]').check();
          //   }else{
          //   	form.getCheckBox('form1[0].#subform[3].Pt3Line5_Unit[1]').uncheck();
          //   }

          //   if(user.data.application.insideusifany_name=='92'){
          //   	form.getCheckBox('form1[0].#subform[3].Pt3Line5_Unit[2]').check();
          //   }else{
          //   	form.getCheckBox('form1[0].#subform[3].Pt3Line5_Unit[2]').uncheck();
          //   }

          //   if (user.data.application.usifanyselest_name) {
          //   	form.getTextField('form1[0].#subform[3].Pt3Line5_AptSteFlrNumber[0]').setText(user.data.application.usifanyselest_name);
          //   }

          // Street number and name

          // =====================================================================================================================================================================================================================================================

          if (user.data.application.sizeee_name) {
            form
              .getTextField("form1[0].#subform[12].Pt8Line62_FamilyStatus[0]")
              .setText(user.data.application.sizeee_name?.toUpperCase());
          }

          // if (user.data.application.insideusnumber_name) {
          //   form.getTextField('form1[0].#subform[4].Pt3Line5_StreetNumberName[0]').setText(user.data.application.insideusnumber_name?.toUpperCase());
          // }

          // // State

          // if (user.data.application.insideusstate_name) {
          //   form.getDropdown('form1[0].#subform[4].Pt3Line5_State[0]').select(user.data.application.insideusstate_name);
          // }

          // // City or tawn

          // if (user.data.application.insideusgcity_name) {
          //   form.getTextField('form1[0].#subform[4].Pt3Line5_CityOrTown[0]').setText(user.data.application.insideusgcity_name?.toUpperCase());
          // }

          // // ZIP code

          // if (user.data.application.insideuscode_name) {
          //   form.getTextField('form1[0].#subform[4].Pt3Line5_ZipCode[0]').setText(user.data.application.insideuscode_name?.toUpperCase());
          // }

          // const asdutytq = new Date(user.data.application.theseorganizations_names[0].certificationifany_name);

          //                 // form.getTextField('form1[0].#subform[0].P2_Line4_DateOfBirth[0]').setText( d.getFullYear() + '.' + (d.getMonth() < 9 && 0 + (d.getMonth()+1)) + '.' + d.getDate());

          //                 form.getTextField('form1[0].#subform[8].Pt8Line5b_DateTo[0]').setText((asdutytq.getMonth()+1) + '/' + asdutytq.getDate() + '/' + asdutytq.getFullYear() );

          // ORGANIZATION

          if (Array.isArray(user.data.application.theseorganizations_names)) {
            if (user.data.application.theseorganizations_names.length > 0) {
              // Name of organization

              if (
                user.data.application.theseorganizations_names[0]
                  .nameorganization_name
              ) {
                form
                  .getTextField("form1[0].#subform[8].Pt8Line2_OrgName[0]")
                  .setText(
                    user.data.application.theseorganizations_names[0].nameorganization_name?.toUpperCase()
                  );
              }

              // City or town

              if (
                user.data.application.theseorganizations_names[0]
                  .locationcityortawn_name
              ) {
                form
                  .getTextField("form1[0].#subform[8].Pt8Line3a_CityTown[0]")
                  .setText(
                    user.data.application.theseorganizations_names[0].locationcityortawn_name?.toUpperCase()
                  );
              }

              // State or province

              if (
                user.data.application.theseorganizations_names[0]
                  .locationstateor_name
              ) {
                form
                  .getTextField("form1[0].#subform[8].Pt8Line3b_State[0]")
                  .setText(
                    user.data.application.theseorganizations_names[0].locationstateor_name?.toUpperCase()
                  );
              }

              // Country

              if (
                user.data.application.theseorganizations_names[0]
                  .locationcountryus_name
              ) {
                form
                  .getTextField("form1[0].#subform[8].Pt8Line3c_Country[0]")
                  .setText(
                    user.data.application.theseorganizations_names[0].locationcountryus_name?.toUpperCase()
                  );
              }

              // Nature of group

              if (
                user.data.application.theseorganizations_names[0]
                  .natureofdroup_name
              ) {
                form
                  .getTextField("form1[0].#subform[8].Pt8Line4_Group[0]")
                  .setText(
                    user.data.application.theseorganizations_names[0].natureofdroup_name?.toUpperCase()
                  );
              }

              // Membership or involvement start date

              // const asdgfgfgh = user.data.application.theseorganizations_names[0].certificationifanyus_name;
              // if (Array.isArray(asdgfgfgh) && asdgfgfgh.length) {
              // 	const asdfgh = new Date(asdgfgfgh[0]);
              // 	if (isNaN(asdfgh) || !asdfgh) asdfgh = new Date();
              // 	let date_to_fillkk = (asdfgh.getMonth() < 9 && '0' || '') + (asdfgh.getMonth() + 1) + '/';
              // 	date_to_fillkk += (asdfgh.getDate() < 10 && '0' || '') + asdfgh.getDate() + '/' + asdfgh.getFullYear();
              // 	form.getTextField('form1[0].#subform[8].Pt8Line5a_DateFrom[0]').setText(date_to_fillkk.toLocaleString());
              // }

              // if (
              //   user.data.application.theseorganizations_names[0]
              //     .certificationifanyus_name
              // ) {
              //   form
              //     .getTextField("form1[0].#subform[8].Pt8Line5a_DateFrom[0]")
              //     .setText(
              //       dateFormatter(
              //         user.data.application.theseorganizations_names[0]
              //           .certificationifanyus_name
              //       )
              //     );
              // }

              // Membership or involvement end date

              // const ghjhfgfd = user.data.application.theseorganizations_names[0].certificationifany_name;
              // if (Array.isArray(ghjhfgfd) && ghjhfgfd.length) {
              // 	const asdutyt = new Date(ghjhfgfd[0]);
              // 	if (isNaN(asdutyt) || !asdutyt) asdutyt = new Date();
              // 	let date_to_fillll = (asdutyt.getMonth() < 9 && '0' || '') + (asdutyt.getMonth() + 1) + '/';
              // 	date_to_fillll += (asdutyt.getDate() < 10 && '0' || '') + asdutyt.getDate() + '/' + asdutyt.getFullYear();
              // 	form.getTextField('form1[0].#subform[8].Pt8Line5b_DateTo[0]').setText(date_to_fillll.toLocaleString());
              // }

              if (
                user.data.application.theseorganizations_names[0]
                  .involvementend_name
              ) {
                form
                  .getTextField("form1[0].#subform[8].Pt8Line5b_DateTo[0]")
                  .setText("PRESENT");
              }

              // if (
              //   user.data.application.theseorganizations_names[0]
              //     .certificationifany_name
              // ) {
              //   form
              //     .getTextField("form1[0].#subform[8].Pt8Line5b_DateTo[0]")
              //     .setText(
              //       dateFormatter(
              //         user.data.application.theseorganizations_names[0]
              //           .certificationifany_name
              //       )
              //     );
              // }
            }

            if (user.data.application.theseorganizations_names.length > 1) {
              // Name of organization

              if (
                user.data.application.theseorganizations_names[1]
                  .nameorganization_name
              ) {
                form
                  .getTextField("form1[0].#subform[8].Pt8Line6_OrgName[0]")
                  .setText(
                    user.data.application.theseorganizations_names[1].nameorganization_name?.toUpperCase()
                  );
              }

              // City or town

              if (
                user.data.application.theseorganizations_names[1]
                  .locationcityortawn_name
              ) {
                form
                  .getTextField("form1[0].#subform[8].Pt8Line8a_CityTown[0]")
                  .setText(
                    user.data.application.theseorganizations_names[1].locationcityortawn_name?.toUpperCase()
                  );
              }

              // State or province

              if (
                user.data.application.theseorganizations_names[1]
                  .locationstateor_name
              ) {
                form
                  .getTextField("form1[0].#subform[8].Pt8Line7b_State[0]")
                  .setText(
                    user.data.application.theseorganizations_names[1].locationstateor_name?.toUpperCase()
                  );
              }

              // Country

              if (
                user.data.application.theseorganizations_names[1]
                  .locationcountryus_name
              ) {
                form
                  .getTextField("form1[0].#subform[8].Pt8Line7c_Country[0]")
                  .setText(
                    user.data.application.theseorganizations_names[1].locationcountryus_name?.toUpperCase()
                  );
              }

              // Nature of group

              if (
                user.data.application.theseorganizations_names[1]
                  .natureofdroup_name
              ) {
                form
                  .getTextField("form1[0].#subform[8].Pt8Line8_Group[0]")
                  .setText(
                    user.data.application.theseorganizations_names[1].natureofdroup_name?.toUpperCase()
                  );
              }

              // Membership or involvement start date

              if (
                user.data.application.theseorganizations_names[1]
                  .involvementend_name
              ) {
                form
                  .getTextField("form1[0].#subform[9].Pt8Line9b_DateTo[0]")
                  .setText("PRESENT");
              }
              // const asdfghasdasd = user.data.application.theseorganizations_names[1].certificationifanyus_name;
              // if (Array.isArray(asdfghasdasd) && asdfghasdasd.length) {
              // 	const asdfgh = new Date(asdfghasdasd[0]);
              // 	if (isNaN(asdfgh) || !asdfgh) asdfgh = new Date();
              // 	let date_to_fillzz = (asdfgh.getMonth() < 9 && '0' || '') + (asdfgh.getMonth() + 1) + '/';
              // 	date_to_fillzz += (asdfgh.getDate() < 10 && '0' || '') + asdfgh.getDate() + '/' + asdfgh.getFullYear();
              // 	form.getTextField('form1[0].#subform[9].Pt8Line9a_DateFrom[0]').setText(date_to_fillzz.toLocaleString());
              // }

              if (
                user.data.application.theseorganizations_names[1]
                  .certificationifanyus_name
              ) {
                form
                  .getTextField("form1[0].#subform[9].Pt8Line9a_DateFrom[0]")
                  .setText(
                    dateFormatter(
                      user.data.application.theseorganizations_names[1]
                        .certificationifanyus_name
                    )
                  );
              }

              // Membership or involvement end date

              // const asdutytrrr = user.data.application.theseorganizations_names[1].certificationifany_name;
              // if (Array.isArray(asdutytrrr) && asdutytrrr.length) {
              // 	const asdutyt = new Date(asdutytrrr[0]);
              // 	if (isNaN(asdutyt) || !asdutyt) asdutyt = new Date();
              // 	let date_to_fillxx = (asdutyt.getMonth() < 9 && '0' || '') + (asdutyt.getMonth() + 1) + '/';
              // 	date_to_fillxx += (asdutyt.getDate() < 10 && '0' || '') + asdutyt.getDate() + '/' + asdutyt.getFullYear();
              // 	form.getTextField('form1[0].#subform[9].Pt8Line9b_DateTo[0]').setText(date_to_fillxx.toLocaleString());
              // }

              if (
                user.data.application.theseorganizations_names[1]
                  .certificationifany_name
              ) {
                form
                  .getTextField("form1[0].#subform[9].Pt8Line9b_DateTo[0]")
                  .setText(
                    dateFormatter(
                      user.data.application.theseorganizations_names[1]
                        .certificationifany_name
                    )
                  );
              }
            }

            if (user.data.application.theseorganizations_names.length > 2) {
              // Name of organization

              if (
                user.data.application.theseorganizations_names[2]
                  .nameorganization_name
              ) {
                form
                  .getTextField("form1[0].#subform[9].Pt8Line10_OrgName[0]")
                  .setText(
                    user.data.application.theseorganizations_names[2].nameorganization_name?.toUpperCase()
                  );
              }

              // City or town

              if (
                user.data.application.theseorganizations_names[2]
                  .locationcityortawn_name
              ) {
                form
                  .getTextField("form1[0].#subform[9].Pt8Line11a_CityTown[0]")
                  .setText(
                    user.data.application.theseorganizations_names[2].locationcityortawn_name?.toUpperCase()
                  );
              }

              // State or province

              if (
                user.data.application.theseorganizations_names[2]
                  .locationstateor_name
              ) {
                form
                  .getTextField("form1[0].#subform[9].Pt8Line11b_State[0]")
                  .setText(
                    user.data.application.theseorganizations_names[2].locationstateor_name?.toUpperCase()
                  );
              }

              // Country

              if (
                user.data.application.theseorganizations_names[2]
                  .locationcountryus_name
              ) {
                form
                  .getTextField("form1[0].#subform[9].Pt8Line11c_Country[0]")
                  .setText(
                    user.data.application.theseorganizations_names[2].locationcountryus_name?.toUpperCase()
                  );
              }

              // Nature of group

              if (
                user.data.application.theseorganizations_names[2]
                  .natureofdroup_name
              ) {
                form
                  .getTextField("form1[0].#subform[9].Pt8Line12_Group[0]")
                  .setText(
                    user.data.application.theseorganizations_names[2].natureofdroup_name?.toUpperCase()
                  );
              }

              if (
                user.data.application.theseorganizations_names[2]
                  .involvementend_name
              ) {
                form
                  .getTextField("form1[0].#subform[9].Pt8Line13b_DateTo[0]")
                  .setText("PRESENT");
              }

              // Membership or involvement start date

              // const asdfghpopo = user.data.application.theseorganizations_names[2].certificationifanyus_name;
              // if (Array.isArray(asdfghpopo) && asdfghpopo.length) {
              // 	const asdfgh = new Date(asdfghpopo[0]);
              // 	if (isNaN(asdfgh) || !asdfgh) asdfgh = new Date();
              // 	let date_to_fill = (asdfgh.getMonth() < 9 && '0' || '') + (asdfgh.getMonth() + 1) + '/';
              // 	date_to_fill += (asdfgh.getDate() < 10 && '0' || '') + asdfgh.getDate() + '/' + asdfgh.getFullYear();
              // 	form.getTextField('form1[0].#subform[9].Pt8Line13a_DateFrom[0]').setText(date_to_fill.toLocaleString());
              // }

              if (
                user.data.application.theseorganizations_names[2]
                  .certificationifanyus_name
              ) {
                form
                  .getTextField("form1[0].#subform[9].Pt8Line13a_DateFrom[0]")
                  .setText(
                    dateFormatter(
                      user.data.application.theseorganizations_names[2]
                        .certificationifanyus_name
                    )
                  );
              }

              // Membership or involvement end date

              // const ghjghjtyt = user.data.application.theseorganizations_names[2].certificationifany_name;
              // if (Array.isArray(ghjghjtyt) && ghjghjtyt.length) {
              // 	const asdutyt = new Date(ghjghjtyt[0]);
              // 	if (isNaN(asdutyt) || !asdutyt) asdutyt = new Date();
              // 	let date_to_fillvv = (asdutyt.getMonth() < 9 && '0' || '') + (asdutyt.getMonth() + 1) + '/';
              // 	date_to_fillvv += (asdutyt.getDate() < 10 && '0' || '') + asdutyt.getDate() + '/' + asdutyt.getFullYear();
              // 	form.getTextField('form1[0].#subform[9].Pt8Line13b_DateTo[0]').setText(date_to_fillvv.toLocaleString());
              // }

              if (
                user.data.application.theseorganizations_names[2]
                  .certificationifany_name
              ) {
                form
                  .getTextField("form1[0].#subform[9].Pt8Line13b_DateTo[0]")
                  .setText(
                    dateFormatter(
                      user.data.application.theseorganizations_names[2]
                        .certificationifany_name
                    )
                  );
              }
            }
          }

          // Date of birth

          // const asdasdfdsvvx = user.data.application.citizenship_name;
          // if (Array.isArray(asdasdfdsvvx) && asdasdfdsvvx.length) {
          // 	const asd = new Date(asdasdfdsvvx[0]);
          // 	if (isNaN(asd) || !asd) asd = new Date();
          // 	let date_to_fillbb = (asd.getMonth() < 9 && '0' || '') + (asd.getMonth() + 1) + '/';
          // 	date_to_fillbb += (asd.getDate() < 10 && '0' || '') + asd.getDate() + '/' + asd.getFullYear();
          // 	form.getTextField('form1[0].#subform[0].Pt1Line5_DateofBirth[0]').setText(date_to_fillbb.toLocaleString());
          // }

          23;
          if (user.data.application.citizenship_name) {
            form
              .getTextField("form1[0].#subform[0].Pt1Line5_DateofBirth[0]")
              .setText(dateFormatter(user.data.application.citizenship_name));
          }

          // Country of birth

          if (user.data.application.birth_name) {
            form
              .getTextField("form1[0].#subform[1].Pt1Line8_CountryofBirth[0]")
              .setText(user.data.application.birth_name?.toUpperCase());
          }

          // City or town of birth

          if (user.data.application.city_name) {
            form
              .getTextField("form1[0].#subform[0].Pt1Line6_CityOrTown[0]")
              .setText(user.data.application.city_name?.toUpperCase());
          }

          if (user.data.application.family_name) {
            form
              .getTextField("form1[0].#subform[19].Pt1Line1a_FamilyName[1]")
              .setText(user.data.application.family_name?.toUpperCase());
          }

          if (user.data.application.name) {
            form
              .getTextField("form1[0].#subform[19].Pt1Line1b_GivenName[1]")
              .setText(user.data.application.name?.toUpperCase());
          }

          if (user.data.application.middle_name) {
            form
              .getTextField("form1[0].#subform[19].Pt1Line1c_MiddleName[1]")
              .setText(user.data.application.middle_name?.toUpperCase());
          }

          if (user.data.application.usregistrationnumber_name) {
            form
              .getTextField("form1[0].#subform[19].Pt1Line10_AlienNumber[20]")
              .setText(
                user.data.application.usregistrationnumber_name?.toUpperCase()
              );
          }

          // JERRY's U.S. social security number

          // if (user.data.application.securitynumberone_name + user.data.application.securitynumbertwo_name + user.data.application.securitynumberthree_name) {
          //   form.getTextField('form1[0].#subform[1].Pt1Line16_SSN[0]').setText(user.data.application.securitynumberone_name + user.data.application.securitynumbertwo_name + user.data.application.securitynumberthree_name);

          // }

          // JERRY's Registration number

          // if(user.data.application.a_number_name){
          // 	form.getTextField('').setText(user.data.application.a_number_name);

          // }

          // JERRY's biographic info

          // Ethnicity

          if (user.data.application.ethnicity_name == "Hispanic or Latino") {
            form
              .getCheckBox("form1[0].#subform[8].Pt7Line1_Ethnicity[0]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[8].Pt7Line1_Ethnicity[0]")
              .uncheck();
          }
          if (
            user.data.application.ethnicity_name == "Not Hispanic or Latino"
          ) {
            form
              .getCheckBox("form1[0].#subform[8].Pt7Line1_Ethnicity[1]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[8].Pt7Line1_Ethnicity[1]")
              .uncheck();
          }

          // Race

          if (user.data.application.rasewhite_name) {
            form.getCheckBox("form1[0].#subform[8].Pt7Line2_Race[1]").check();
          }

          if (user.data.application.raseasian_name) {
            form.getCheckBox("form1[0].#subform[8].Pt7Line2_Race[0]").check();
          }

          if (user.data.application.raseblack_name) {
            form.getCheckBox("form1[0].#subform[8].Pt7Line2_Race[2]").check();
          }

          if (user.data.application.rasenative_name) {
            form.getCheckBox("form1[0].#subform[8].Pt7Line2_Race[3]").check();
          }

          if (user.data.application.rasehawaiian_name) {
            form.getCheckBox("form1[0].#subform[8].Pt7Line2_Race[4]").check();
          }

          // Eye color

          if (user.data.application.eyecolor_name == "black") {
            form
              .getCheckBox("form1[0].#subform[8].Pt7Line5_Eyecolor[0]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[8].Pt7Line5_Eyecolor[0]")
              .uncheck();
          }

          if (user.data.application.eyecolor_name == "gray") {
            form
              .getCheckBox("form1[0].#subform[8].Pt7Line5_Eyecolor[1]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[8].Pt7Line5_Eyecolor[1]")
              .uncheck();
          }

          if (user.data.application.eyecolor_name == "maroon") {
            form
              .getCheckBox("form1[0].#subform[8].Pt7Line5_Eyecolor[6]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[8].Pt7Line5_Eyecolor[6]")
              .uncheck();
          }

          if (user.data.application.eyecolor_name == "blue") {
            form
              .getCheckBox("form1[0].#subform[8].Pt7Line5_Eyecolor[3]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[8].Pt7Line5_Eyecolor[3]")
              .uncheck();
          }

          if (user.data.application.eyecolor_name == "green") {
            form
              .getCheckBox("form1[0].#subform[8].Pt7Line5_Eyecolor[4]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[8].Pt7Line5_Eyecolor[4]")
              .uncheck();
          }

          if (user.data.application.eyecolor_name == "pink") {
            form
              .getCheckBox("form1[0].#subform[8].Pt7Line5_Eyecolor[5]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[8].Pt7Line5_Eyecolor[5]")
              .uncheck();
          }

          if (user.data.application.eyecolor_name == "brown") {
            form
              .getCheckBox("form1[0].#subform[8].Pt7Line5_Eyecolor[2]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[8].Pt7Line5_Eyecolor[2]")
              .uncheck();
          }

          if (user.data.application.eyecolor_name == "hazel") {
            form
              .getCheckBox("form1[0].#subform[8].Pt7Line5_Eyecolor[7]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[8].Pt7Line5_Eyecolor[7]")
              .uncheck();
          }

          if (user.data.application.eyecolor_name == "unknown") {
            form
              .getCheckBox("form1[0].#subform[8].Pt7Line5_Eyecolor[8]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[8].Pt7Line5_Eyecolor[8]")
              .uncheck();
          }

          // Hair color

          if (user.data.application.colorhair_name == "bald") {
            form
              .getCheckBox("form1[0].#subform[8].Pt7Line6_Haircolor[0]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[8].Pt7Line6_Haircolor[0]")
              .uncheck();
          }

          if (user.data.application.colorhair_name == "brown") {
            form
              .getCheckBox("form1[0].#subform[8].Pt7Line6_Haircolor[3]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[8].Pt7Line6_Haircolor[3]")
              .uncheck();
          }

          if (user.data.application.colorhair_name == "blond") {
            form
              .getCheckBox("form1[0].#subform[8].Pt7Line6_Haircolor[2]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[8].Pt7Line6_Haircolor[2]")
              .uncheck();
          }

          if (user.data.application.colorhair_name == "black") {
            form
              .getCheckBox("form1[0].#subform[8].Pt7Line6_Haircolor[1]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[8].Pt7Line6_Haircolor[1]")
              .uncheck();
          }

          if (user.data.application.colorhair_name == "gray") {
            form
              .getCheckBox("form1[0].#subform[8].Pt7Line6_Haircolor[4]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[8].Pt7Line6_Haircolor[4]")
              .uncheck();
          }

          if (user.data.application.colorhair_name == "red") {
            form
              .getCheckBox("form1[0].#subform[8].Pt7Line6_Haircolor[5]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[8].Pt7Line6_Haircolor[5]")
              .uncheck();
          }

          if (user.data.application.colorhair_name == "sandy") {
            form
              .getCheckBox("form1[0].#subform[8].Pt7Line6_Haircolor[6]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[8].Pt7Line6_Haircolor[6]")
              .uncheck();
          }

          if (user.data.application.colorhair_name == "white") {
            form
              .getCheckBox("form1[0].#subform[8].Pt7Line6_Haircolor[7]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[8].Pt7Line6_Haircolor[7]")
              .uncheck();
          }

          if (user.data.application.colorhair_name == "unknown") {
            form
              .getCheckBox("form1[0].#subform[8].Pt7Line6_Haircolor[8]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[8].Pt7Line6_Haircolor[8]")
              .uncheck();
          }

          // Weight

          if (user.data.application.uspounds_name) {
            form
              .getTextField("form1[0].#subform[8].Pt7Line4_Weight1[0]")
              .setText(user.data.application.uspounds_name);
          }
          if (user.data.application.uspoundsa_name) {
            form
              .getTextField("form1[0].#subform[8].Pt7Line4_Weight2[0]")
              .setText(user.data.application.uspoundsa_name);
          }
          if (user.data.application.uspoundss_name) {
            form
              .getTextField("form1[0].#subform[8].Pt7Line4_Weight3[0]")
              .setText(user.data.application.uspoundss_name);
          }

          // Height

          if (user.data.application.usfeet_name) {
            form
              .getDropdown("form1[0].#subform[8].Pt7Line3_HeightFeet[0]")
              .select(user.data.application.usfeet_name);
          }

          if (user.data.application.usinches_name) {
            form
              .getDropdown("form1[0].#subform[8].Pt7Line3_HeightInches[0]")
              .select(user.data.application.usinches_name);
          }

          if (user.data.application.graybox_name == "no") {
            form.getCheckBox("form1[0].#subform[3].Pt2Line2_CB[1]").check();
          } else {
            form.getCheckBox("form1[0].#subform[3].Pt2Line2_CB[1]").uncheck();
          }

          if (user.data.application.graybox_name == "yes") {
            form.getCheckBox("form1[0].#subform[3].Pt2Line2_CB[0]").check();
          } else {
            form.getCheckBox("form1[0].#subform[3].Pt2Line2_CB[0]").uncheck();
          }

          // Number children

          if (user.data.application.livingchildrent_name) {
            form
              .getTextField("form1[0].#subform[7].Pt6Line1_TotalChildren[0]")
              .setText(user.data.application.livingchildrent_name);
          }

          // Prior Number

          if (user.data.application.livingmarried_name) {
            form
              .getTextField("form1[0].#subform[6].Pt5Line3_TimesMarried[0]")
              .setText(user.data.application.livingmarried_name);
          }

          if (user.data.application.phonenumber_name) {
            form
              .getTextField("form1[0].#subform[15].Pt10Line3_DaytimePhone[0]")
              .setText(user.data.application.phonenumber_name);
          }

          if (user.data.application.mobile_name) {
            form
              .getTextField("form1[0].#subform[15].Pt10Line4_MobilePhone[0]")
              .setText(user.data.application.mobile_name);
          }

          if (user.data.application.register_name) {
            form
              .getTextField("form1[0].#subform[15].Pt10Line5_Email[0]")
              .setText(user.data.application.register_name?.toUpperCase());
          }

          if (user.data.application.orimpairments_name == "no") {
            form
              .getCheckBox("form1[0].#subform[15].Pt9Line1_YesNo[0]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[15].Pt9Line1_YesNo[0]")
              .uncheck();
          }

          if (user.data.application.orimpairments_name == "yes") {
            form
              .getCheckBox("form1[0].#subform[15].Pt9Line1_YesNo[1]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[15].Pt9Line1_YesNo[1]")
              .uncheck();
          }

          if (user.data.application.name) {
            form
              .getCheckBox("form1[0].#subform[15].Pt10Line1_English[1]")
              .check();
          }

          if (user.data.application.ofhearing_name) {
            form
              .getCheckBox("form1[0].#subform[15].Pt9Line2a_Deaf[0]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[15].Pt9Line2a_Deaf[0]")
              .uncheck();
          }

          if (user.data.application.lowvision_name) {
            form
              .getCheckBox("form1[0].#subform[15].Pt9Line2b_Blind[0]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[15].Pt9Line2b_Blind[0]")
              .uncheck();
          }

          if (user.data.application.anothertypeofdisability_name) {
            form
              .getCheckBox("form1[0].#subform[15].Pt9Line2c_Other[0]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[15].Pt9Line2c_Other[0]")
              .uncheck();
          }

          if (user.data.application.anymilitaryservice_name == "no") {
            form
              .getCheckBox("form1[0].#subform[8].Pt8Line1_YesNo[0]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[8].Pt8Line1_YesNo[0]")
              .uncheck();
          }
          if (user.data.application.anymilitaryservice_name == "yes") {
            form
              .getCheckBox("form1[0].#subform[8].Pt8Line1_YesNo[1]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[8].Pt8Line1_YesNo[1]")
              .uncheck();
          }

          // number 1

          if (user.data.application.accommodationtorequest_name) {
            form
              .getTextField(
                "form1[0].#subform[15].Pt9Line2b_Accommodation[0]"
              )
              .setText(
                user.data.application.accommodationtorequest_name?.toUpperCase()
              );
          }

          // number 2

          if (user.data.application.torequestext_name) {
            form
              .getTextField(
                "form1[0].#subform[15].Pt9Line2a_Accommodation[0]"
              )
              .setText(
                user.data.application.torequestext_name?.toUpperCase()
              );
          }

          // number 3

          if (
            user.data.application.ofthedisabilityand_name +
            user.data.application.whataccommodation_name
          ) {
            form
              .getTextField(
                "form1[0].#subform[15].Pt9Line2c_Accommodation[0]"
              )
              .setText(
                user.data.application.ofthedisabilityand_name +
                  "," +
                  user.data.application.whataccommodation_name?.toUpperCase()
              );
          }

          // if (user.data.application.usarrivedinthe_name == "yes") {
          //   form.getCheckBox('form1[0].#subform[2].Pt1Line22a_CB[0]').check();
          // } else {
          //   form.getCheckBox('form1[0].#subform[2].Pt1Line22a_CB[0]').uncheck();
          // }

          // if (user.data.application.arrivedintheus_name) {
          //   form.getTextField('form1[0].#subform[2].Pt1Line22a_AdmissionEntry[0]').setText(user.data.application.arrivedintheus_name?.toUpperCase());
          // }

          // if (user.data.application.usarrivedinthe_name == "no") {
          //   form.getCheckBox('form1[0].#subform[2].Pt1Line22b_CB[0]').check();
          // } else {
          //   form.getCheckBox('form1[0].#subform[2].Pt1Line22b_CB[0]').uncheck();
          // }

          if (user.data.application.wasparoled_name) {
            form
              .getTextField(
                "form1[0].#subform[2].Pt1Line25b_ParoleEntrance[0]"
              )
              .setText(user.data.application.wasparoled_name?.toUpperCase());
          }

          // const ljkjkljasdasdj = user.data.application.form94_name;
          // if (Array.isArray(ljkjkljasdasdj) && ljkjkljasdasdj.length) {
          // 	const ljkjkljj = new Date(ljkjkljasdasdj[0]);
          // 	if (isNaN(ljkjkljj) || !ljkjkljj) ljkjkljj = new Date();
          // 	let date_to_fillnn = (ljkjkljj.getMonth() < 9 && '0' || '') + (ljkjkljj.getMonth() + 1) + '/';
          // 	date_to_fillnn += (ljkjkljj.getDate() < 10 && '0' || '') + ljkjkljj.getDate() + '/' + ljkjkljj.getFullYear();
          // 	form.getTextField('form1[0].#subform[2].Pt1Line23b_Date[0]').setText(date_to_fillnn.toLocaleString());
          // }

          // if (user.data.application.form94_name) {
          //   form.getTextField('form1[0].#subform[2].Pt1Line23b_Date[0]').setText(dateFormatter(user.data.application.form94_name));
          // }

          // if (user.data.application.form94middleqqq_name) {
          //   form.getTextField('form1[0].#subform[2].Pt1Line23c_Status[0]').setText(user.data.application.form94middleqqq_name?.toUpperCase());
          // }

          // if (user.data.application.form94middleform_name) {
          //   form.getTextField('form1[0].#subform[2].Pt1Line24_Status[0]').setText(user.data.application.form94middleform_name?.toUpperCase());
          // }

          if (user.data.application.name) {
            form.getCheckBox("form1[0].#subform[2].Pt2Line1_CB[0]").check();
          }

          if (user.data.application.embassyus_name == "no") {
            form.getCheckBox("form1[0].#subform[3].Pt3Line1_YN[0]").check();
          } else {
            form.getCheckBox("form1[0].#subform[3].Pt3Line1_YN[0]").uncheck();
          }
          if (user.data.application.embassyus_name == "yes") {
            form.getCheckBox("form1[0].#subform[3].Pt3Line1_YN[1]").check();
          } else {
            form.getCheckBox("form1[0].#subform[3].Pt3Line1_YN[1]").uncheck();
          }

          // Immigration info

          // if (user.data.application.passportnumberus_name) {
          //   form.getTextField('form1[0].#subform[1].Pt1Line15_PassportNum[0]').setText(user.data.application.passportnumberus_name?.toUpperCase());
          // }

          // const sdffdssdfqq = user.data.application.form94_name;
          // if (Array.isArray(sdffdssdfqq) && sdffdssdfqq.length) {
          // 	const sdffdssdf = new Date(sdffdssdfqq[0]);
          // 	if (isNaN(sdffdssdf) || !sdffdssdf) sdffdssdf = new Date();
          // 	let date_to_fillmm = (sdffdssdf.getMonth() < 9 && '0' || '') + (sdffdssdf.getMonth() + 1) + '/';
          // 	date_to_fillmm += (sdffdssdf.getDate() < 10 && '0' || '') + sdffdssdf.getDate() + '/' + sdffdssdf.getFullYear();
          // 	form.getTextField('form1[0].#subform[1].Pt1Line17_ExpDate[0]').setText(date_to_fillmm.toLocaleString());
          // }

          // if (user.data.application.travelexpirationdateus_name) {
          //   form.getTextField('form1[0].#subform[1].Pt1Line17_ExpDate[0]').setText(dateFormatter(user.data.application.travelexpirationdateus_name));
          // }

          if (user.data.application.uslastarrival_name) {
            form
              .getTextField("form1[0].#subform[1].Pt1Line24_Date[0]")
              .setText(
                dateFormatter(user.data.application.uslastarrival_name)
              );
          }

          if (user.data.application.passportnumberus_name) {
            form
              .getTextField("form1[0].#subform[1].Pt1Line18_PassportNum[0]")
              .setText(
                user.data.application.passportnumberus_name?.toUpperCase()
              );
          }
          if (user.data.application.travelpassportnumberus_name) {
            form
              .getTextField("form1[0].#subform[1].Pt2Line19_TravelDoc[0]")
              .setText(
                user.data.application.travelpassportnumberus_name?.toUpperCase()
              );
          }

          // Travel document number

          // if (user.data.application.travelpassportnumberus_name) {
          //   form.getTextField('form1[0].#subform[1].Pt2Line19_TravelDoc[0]').setText(user.data.application.travelpassportnumberus_name?.toUpperCase());
          // }

          if (user.data.application.expirationdateus_name) {
            form
              .getTextField("form1[0].#subform[1].Pt1Line20_ExpDate[0]")
              .setText(
                dateFormatter(user.data.application.expirationdateus_name)
              );
          }

          if (user.data.application.traveluscountry_name) {
            form
              .getTextField("form1[0].#subform[1].Pt1Line21_Passport[0]")
              .setText(
                user.data.application.traveluscountry_name?.toUpperCase()
              );
          }

          if (user.data.application.uscountry_name) {
            form
              .getTextField("form1[0].#subform[1].Pt1Line21_Passport[0]")
              .setText(user.data.application.uscountry_name?.toUpperCase());
          }

          if (user.data.application.uscountryofissuance_name) {
            form
              .getTextField("form1[0].#subform[1].Pt1Line21_Passport[0]")
              .setText(
                user.data.application.uscountryofissuance_name?.toUpperCase()
              );
          }

          if (user.data.application.traveluscountry_name) {
            form
              .getTextField("form1[0].#subform[1].Pt1Line21_Passport[0]")
              .setText(
                user.data.application.traveluscountry_name?.toUpperCase()
              );
          }

          if (user.data.application.uscountry_name) {
            form
              .getTextField("form1[0].#subform[1].Pt1Line21_Passport[0]")
              .setText(user.data.application.uscountry_name?.toUpperCase());
          }

          if (user.data.application.visanumberus_name) {
            form
              .getTextField("form1[0].#subform[1].Pt1Line22_VisaNum[0]")
              .setText(
                user.data.application.visanumberus_name?.toUpperCase()
              );
          }

          // City or town

          if (user.data.application.uscityoftawn_name) {
            form
              .getTextField("form1[0].#subform[1].Pt1Line23a_CityTown[0]")
              .setText(
                user.data.application.uscityoftawn_name?.toUpperCase()
              );
          }

          // State

          if (user.data.application.usstate_name) {
            form
              .getDropdown("form1[0].#subform[1].Pt1Line23b_State[0]")
              .select(user.data.application.usstate_name?.toUpperCase());
          }

          // Date of last arrival

          // const mnnmmnmnmn = user.data.application.uslastarrivaldate_name;
          // if (Array.isArray(mnnmmnmnmn) && mnnmmnmnmn.length) {
          // 	const asz = new Date(mnnmmnmnmn[0]);
          // 	if (isNaN(asz) || !asz) asz = new Date();
          // 	let date_to_fillqqq = (asz.getMonth() < 9 && '0' || '') + (asz.getMonth() + 1) + '/';
          // 	date_to_fillqqq += (asz.getDate() < 10 && '0' || '') + asz.getDate() + '/' + asz.getFullYear();
          // 	form.getTextField('form1[0].#subform[1].Pt1Line21_Date[0]').setText(date_to_fillqqq.toLocaleString());
          // }

          // if (user.data.application.uslastarrivaldate_name) {
          //   form.getTextField('form1[0].#subform[1].Pt1Line21_Date[0]').setText(dateFormatter(user.data.application.uslastarrivaldate_name));
          // }
          if (user.data.application.uslastarrivaldate_name) {
            form
              .getTextField("form1[0].#subform[1].Pt1Line24_Date[0]")
              .setText(
                dateFormatter(user.data.application.uslastarrivaldate_name)
              );
          }
          // Enter JERRY's name exactly as it appears on the Form I-94 (if any)

          // Given name (first name)

          if (user.data.application.form94family_name) {
            form
              .getTextField("form1[0].#subform[2].Pt1Line28a_FamilyName[0]")
              .setText(
                user.data.application.form94family_name?.toUpperCase()
              );
          }

          // Family name (last name)

          if (user.data.application.form94given_name) {
            form
              .getTextField("form1[0].#subform[2].Pt1Line28b_GivenName[0]")
              .setText(user.data.application.form94given_name?.toUpperCase());
          }

          // Middle name

          if (user.data.application.form94middle_name) {
            form
              .getTextField("form1[0].#subform[2].Pt1Line28c_MiddleName[0]")
              .setText(
                user.data.application.form94middle_name?.toUpperCase()
              );
          }

          // Immigration status on Form I-94

          if (user.data.application.usstate_name) {
            form
              .getTextField("form1[0].#subform[2].P2Line26a_I94[0]")
              .setText(user.data.application.usstate_name);
          }

          // JERRY's Alien registration number (A-number) (if any)

          if (user.data.application.usregistrationnumber_name) {
            form
              .getTextField("form1[0].#subform[1].Pt1Line10_AlienNumber[1]")
              .setText(
                user.data.application.usregistrationnumber_name?.toUpperCase()
              );
          }

          // JERRY's USCIS Online Account Number (if any)

          if (user.data.application.filedapetition_name) {
            form
              .getTextField(
                "form1[0].#subform[1].Pt1Line11_USCISELISAcctNumber[0]"
              )
              .setText(
                user.data.application.filedapetition_name?.toUpperCase()
              );
          }

          // if (user.data.application.formrecordnumber_name) {
          //   form.getTextField('form1[0].#subform[2].P2Line23a_I94[0]').setText(user.data.application.formrecordnumber_name);
          // }

          // Family

          // A little about jerry's mother

          // Given name (first name)

          if (user.data.application.mother_name) {
            form
              .getTextField("form1[0].#subform[5].Pt4Line1b_GivenName[0]")
              .setText(user.data.application.mother_name?.toUpperCase());
          }

          // Middle name

          if (user.data.application.mother_middle_name) {
            form
              .getTextField("form1[0].#subform[5].Pt4Line1c_MiddleName[0]")
              .setText(
                user.data.application.mother_middle_name?.toUpperCase()
              );
          }

          // Family name (last name)

          if (user.data.application.mother_family_name) {
            form
              .getTextField("form1[0].#subform[5].Pt4Line1a_FamilyName[0]")
              .setText(
                user.data.application.mother_family_name?.toUpperCase()
              );
          }

          // Given name (first name)

          if (user.data.application.mothers_name) {
            form
              .getTextField("form1[0].#subform[5].Pt4Line2b_GivenName[0]")
              .setText(user.data.application.mothers_name?.toUpperCase());
          }

          // Middle name

          if (user.data.application.mothers_middle_name) {
            form
              .getTextField("form1[0].#subform[5].Pt4Line2c_MiddleName[0]")
              .setText(
                user.data.application.mothers_middle_name?.toUpperCase()
              );
          }

          // Family name (last name)

          if (user.data.application.mothers_family_name) {
            form
              .getTextField("form1[0].#subform[5].Pt4Line2a_FamilyName[0]")
              .setText(
                user.data.application.mothers_family_name?.toUpperCase()
              );
          }

          // Date of birth

          // const aszsxwwee = user.data.application.motherbirth_name;
          // if (Array.isArray(aszsxwwee) && aszsxwwee.length) {
          // 	const aszsx = new Date(aszsxwwee[0]);
          // 	if (isNaN(aszsx) || !aszsx) aszsx = new Date();
          // 	let date_to_fillwww = (aszsx.getMonth() < 9 && '0' || '') + (aszsx.getMonth() + 1) + '/';
          // 	date_to_fillwww += (aszsx.getDate() < 10 && '0' || '') + aszsx.getDate() + '/' + aszsx.getFullYear();
          // 	form.getTextField('form1[0].#subform[5].Pt4Line3_DateofBirth[0]').setText(date_to_fillwww.toLocaleString());
          // }

          if (user.data.application.motherbirth_name) {
            form
              .getTextField("form1[0].#subform[5].Pt4Line3_DateofBirth[0]")
              .setText(dateFormatter(user.data.application.motherbirth_name));
          }

          // Parent Gender

          if (user.data.application.father_name) {
            form
              .getCheckBox("form1[0].#subform[6].Pt4Line12_Gender[1]")
              .check();
          }

          if (user.data.application.mothercity_name) {
            form
              .getTextField("form1[0].#subform[5].Pt4Line5_CityTown[0]")
              .setText(user.data.application.mothercity_name?.toUpperCase());
          }

          if (user.data.application.motherresidence_name) {
            form
              .getTextField("form1[0].#subform[6].Pt4Line7_CityTown[0]")
              .setText(
                user.data.application.motherresidence_name?.toUpperCase()
              );
          }

          if (user.data.application.motherCountry_name) {
            form
              .getTextField("form1[0].#subform[5].Pt4Line6_Country[0]")
              .setText(
                user.data.application.motherCountry_name?.toUpperCase()
              );
          }

          if (user.data.application.mothercurrentus_name) {
            form
              .getTextField("form1[0].#subform[6].Pt4Line8_Country[0]")
              .setText(
                user.data.application.mothercurrentus_name?.toUpperCase()
              );
          }

          // Name of employer or company

          if (user.data.application.employerorcompanyus_name) {
            form
              .getTextField("form1[0].#subform[5].Pt3Line19_EmployerName[0]")
              .setText(
                user.data.application.employerorcompanyus_name?.toUpperCase()
              );
          }

          // Street number and name

          if (user.data.application.usstreetcompany_name) {
            form
              .getTextField(
                "form1[0].#subform[5].Pt3Line20_StreetNumberName[0]"
              )
              .setText(
                user.data.application.usstreetcompany_name?.toUpperCase()
              );
          }

          // Apt./Ste./Flr. Number

          if (user.data.application.asfnumberus_name == "Flr") {
            form
              .getCheckBox("form1[0].#subform[5].Pt3Line20_Unit[0]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[5].Pt3Line20_Unit[0]")
              .uncheck();
          }

          if (user.data.application.asfnumberus_name == "Apt") {
            form
              .getCheckBox("form1[0].#subform[5].Pt3Line20_Unit[1]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[5].Pt3Line20_Unit[1]")
              .uncheck();
          }

          if (user.data.application.asfnumberus_name == "Ste") {
            form
              .getCheckBox("form1[0].#subform[5].Pt3Line20_Unit[2]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[5].Pt3Line20_Unit[2]")
              .uncheck();
          }

          if (user.data.application.name) {
            form
              .getCheckBox("form1[0].#subform[5].Pt4Line4_Gender[0]")
              .check();
          }

          // Number

          if (user.data.application.ste_name) {
            form
              .getTextField(
                "form1[0].#subform[5].Pt3Line20_AptSteFlrNumber[0]"
              )
              .setText(user.data.application.ste_name);
          }

          // Country

          if (user.data.application.cccountry_name) {
            form
              .getTextField("form1[0].#subform[5].Pt3Line20_Country[0]")
              .setText(user.data.application.cccountry_name?.toUpperCase());
          }

          // City or town

          if (user.data.application.townus_name) {
            form
              .getTextField("form1[0].#subform[5].Pt3Line20_CityOrTown[0]")
              .setText(user.data.application.townus_name?.toUpperCase());
          }

          // Province

          if (user.data.application.usprovince_name) {
            form
              .getTextField("form1[0].#subform[5].Pt3Line20_Province[0]")
              .setText(user.data.application.usprovince_name?.toUpperCase());
          }

          // Postal code

          if (user.data.application.postalcodeus_name) {
            form
              .getTextField("form1[0].#subform[5].Pt3Line20_PostalCode[0]")
              .setText(
                user.data.application.postalcodeus_name?.toUpperCase()
              );
          }

          // Occupation

          if (user.data.application.occupationus_name) {
            form
              .getTextField("form1[0].#subform[5].Pt3Line20_EmployerName[0]")
              .setText(
                user.data.application.occupationus_name?.toUpperCase()
              );
          }

          // Employment start date

          // const bvbcxxcz = user.data.application.startemploymentus_name;
          // if (Array.isArray(bvbcxxcz) && bvbcxxcz.length) {
          // 	const hfgfghhgffgh = new Date(bvbcxxcz[0]);
          // 	if (isNaN(hfgfghhgffgh) || !hfgfghhgffgh) hfgfghhgffgh = new Date();
          // 	let date_to_fillrrr = (hfgfghhgffgh.getMonth() < 9 && '0' || '') + (hfgfghhgffgh.getMonth() + 1) + '/';
          // 	date_to_fillrrr += (hfgfghhgffgh.getDate() < 10 && '0' || '') + hfgfghhgffgh.getDate() + '/' + hfgfghhgffgh.getFullYear();
          // 	form.getTextField('form1[0].#subform[5].Pt3Line22a_DateFrom[0]').setText(date_to_fillrrr.toLocaleString());
          // }

          if (user.data.application.startemploymentus_name) {
            form
              .getTextField("form1[0].#subform[5].Pt3Line22a_DateFrom[0]")
              .setText(
                dateFormatter(user.data.application.startemploymentus_name)
              );
          }

          // Employment end date

          // const ljkjklljjj = user.data.application.endemploymentus_name;
          // if (Array.isArray(ljkjklljjj) && ljkjklljjj.length) {
          // 	const ljkjklljk = new Date(ljkjklljjj[0]);
          // 	if (isNaN(ljkjklljk) || !ljkjklljk) ljkjklljk = new Date();
          // 	let date_to_fillttt = (ljkjklljk.getMonth() < 9 && '0' || '') + (ljkjklljk.getMonth() + 1) + '/';
          // 	date_to_fillttt += (ljkjklljk.getDate() < 10 && '0' || '') + ljkjklljk.getDate() + '/' + ljkjklljk.getFullYear();
          // 	form.getTextField('form1[0].#subform[5].Pt3Line22a_DateTo[0]').setText(date_to_fillttt.toLocaleString());
          // }

          // if (user.data.application.endemploymentus_name) {
          //   form
          //     .getTextField("form1[0].#subform[5].Pt3Line22a_DateTo[0]")
          //     .setText(
          //       dateFormatter(user.data.application.endemploymentus_name)
          //     );
          // }

          // Now about jerry's father

          // Given name (first name)

          if (user.data.application.father_name) {
            form
              .getTextField("form1[0].#subform[6].Pt4Line9b_GivenName[0]")
              .setText(user.data.application.father_name?.toUpperCase());
          }

          // Middle name

          if (user.data.application.father_middle_name) {
            form
              .getTextField("form1[0].#subform[6].Pt4Line9c_MiddleName[0]")
              .setText(
                user.data.application.father_middle_name?.toUpperCase()
              );
          }

          // Family name (last name)

          if (user.data.application.father_family_name) {
            form
              .getTextField("form1[0].#subform[6].Pt4Line9a_FamilyName[0]")
              .setText(
                user.data.application.father_family_name?.toUpperCase()
              );
          }

          // Given name (first name)

          if (user.data.application.fathers_name) {
            form
              .getTextField("form1[0].#subform[6].Pt4Line10b_GivenName[0]")
              .setText(user.data.application.fathers_name?.toUpperCase());
          }

          // Middle name

          if (user.data.application.fathers_middle_name) {
            form
              .getTextField("form1[0].#subform[6].Pt4Line10c_MiddleName[0]")
              .setText(
                user.data.application.fathers_middle_name?.toUpperCase()
              );
          }

          // Family name (last name)

          if (user.data.application.fathers_family_name) {
            form
              .getTextField("form1[0].#subform[6].Pt4Line10a_FamilyName[0]")
              .setText(
                user.data.application.fathers_family_name?.toUpperCase()
              );
          }

          // Date of birth

          // const aszsxgaaaa = user.data.application.fatherbirth_name;
          // if (Array.isArray(aszsxgaaaa) && aszsxgaaaa.length) {
          // 	const aszsxg = new Date(aszsxgaaaa[0]);
          // 	if (isNaN(aszsxg) || !aszsxg) aszsxg = new Date();
          // 	let date_to_fillyyy = (aszsxg.getMonth() < 9 && '0' || '') + (aszsxg.getMonth() + 1) + '/';
          // 	date_to_fillyyy += (aszsxg.getDate() < 10 && '0' || '') + aszsxg.getDate() + '/' + aszsxg.getFullYear();
          // 	form.getTextField('form1[0].#subform[6].Pt4Line11_DateofBirth[0]').setText(date_to_fillyyy.toLocaleString());
          // }

          if (user.data.application.fatherbirth_name) {
            form
              .getTextField("form1[0].#subform[6].Pt4Line11_DateofBirth[0]")
              .setText(dateFormatter(user.data.application.fatherbirth_name));
          }

          if (user.data.application.fathercity_name) {
            form
              .getTextField("form1[0].#subform[6].Pt4Line13_CityTown[0]")
              .setText(user.data.application.fathercity_name?.toUpperCase());
          }

          if (user.data.application.fatherresidence_name) {
            form
              .getTextField("form1[0].#subform[6].Pt4Line15_CityTown[0]")
              .setText(
                user.data.application.fatherresidence_name?.toUpperCase()
              );
          }

          if (user.data.application.fathercountry_name) {
            form
              .getTextField("form1[0].#subform[6].Pt4Line14_Country[0]")
              .setText(
                user.data.application.fathercountry_name?.toUpperCase()
              );
          }

          if (user.data.application.usfathercurrent_name) {
            form
              .getTextField("form1[0].#subform[6].Pt4Line16_Country[0]")
              .setText(
                user.data.application.usfathercurrent_name?.toUpperCase()
              );
          }

          // Date of marriage to chuks

          // const aszsxgaap = user.data.application.marriagedate_name;
          // if (Array.isArray(aszsxgaap) && aszsxgaap.length) {
          // 	const asza = new Date(aszsxgaap[0]);
          // 	if (isNaN(asza) || !asza) asza = new Date();
          // 	let date_to_filluuu = (asza.getMonth() < 9 && '0' || '') + (asza.getMonth() + 1) + '/';
          // 	date_to_filluuu += (asza.getDate() < 10 && '0' || '') + asza.getDate() + '/' + asza.getFullYear();
          // 	form.getTextField('form1[0].#subform[6].Pt5Line7_Date[0]').setText(date_to_filluuu.toLocaleString());
          // }

          if (user.data.application.marriagedate_name) {
            form
              .getTextField("form1[0].#subform[6].Pt5Line7_Date[0]")
              .setText(
                dateFormatter(user.data.application.marriagedate_name)
              );
          }

          // City or town

          if (user.data.application.marriagecityortown_name) {
            form
              .getTextField("form1[0].#subform[6].Pt5Line9a_CityTown[0]")
              .setText(
                user.data.application.marriagecityortown_name?.toUpperCase()
              );
          }

          // State (if applicable)

          // if(user.data.application.marriagestate_name){
          // form.getDropdown('form1[0].#subform[6].Pt5Line9b_State[0]').select(user.data.application.marriagestate_name);
          // }

          // Country

          if (user.data.application.marriagecountry_name) {
            form
              .getTextField("form1[0].#subform[6].Pt5Line9c_Country[0]")
              .setText(
                user.data.application.marriagecountry_name?.toUpperCase()
              );
          }

          if (user.data.application.currentmember_name == "NO") {
            form.getCheckBox("form1[0].#subform[6].Pt5Line2_YNNA[0]").check();
          } else {
            form
              .getCheckBox("form1[0].#subform[6].Pt5Line2_YNNA[0]")
              .uncheck();
          }
          if (user.data.application.currentmember_name == "YES") {
            form.getCheckBox("form1[0].#subform[6].Pt5Line2_YNNA[1]").check();
          } else {
            form
              .getCheckBox("form1[0].#subform[6].Pt5Line2_YNNA[1]")
              .uncheck();
          }
          if (user.data.application.currentmember_name == "N/A") {
            form.getCheckBox("form1[0].#subform[6].Pt5Line2_YNNA[2]").check();
          } else {
            form
              .getCheckBox("form1[0].#subform[6].Pt5Line2_YNNA[2]")
              .uncheck();
          }
        }
      }

      // Prior Marriage

      if (Array.isArray(user.data.application.marriages_names)) {
        if (user.data.application.marriages_names.length) {
          // Family name (last name)

          if (user.data.application.marriages_names[0].motherfamily_name) {
            form
              .getTextField("form1[0].#subform[7].Pt511a_FamilyName[0]")
              .setText(
                user.data.application.marriages_names[0].motherfamily_name?.toUpperCase()
              );
          }

          // Given name (first name)

          if (user.data.application.marriages_names[0].mother_name) {
            form
              .getTextField("form1[0].#subform[7].Pt5Line11b_GivenName[0]")
              .setText(
                user.data.application.marriages_names[0].mother_name?.toUpperCase()
              );
          }

          // Middle name

          if (user.data.application.marriages_names[0].mothermiddle_name) {
            form
              .getTextField("form1[0].#subform[7].Pt5Line11c_MiddleName[0]")
              .setText(
                user.data.application.marriages_names[0].mothermiddle_name?.toUpperCase()
              );
          }

          // Prior spouse's date of birth
          // const aszabbnbn = user.data.application.marriages_names[0].marriagedatespouses_name;
          // if (Array.isArray(aszabbnbn) && aszabbnbn.length) {
          // 	const aszab = new Date(aszabbnbn[0]);
          // 	if (isNaN(aszab) || !aszab) aszab = new Date();
          // 	let date_to_filliii = (aszab.getMonth() < 9 && '0' || '') + (aszab.getMonth() + 1) + '/';
          // 	date_to_filliii += (aszab.getDate() < 10 && '0' || '') + aszab.getDate() + '/' + aszab.getFullYear();
          // 	form.getTextField('form1[0].#subform[7].Pt5Line12_DateofBirth[0]').setText(date_to_filliii.toLocaleString());
          // }

          if (
            user.data.application.marriages_names[0].marriagedatespouses_name
          ) {
            form
              .getTextField("form1[0].#subform[7].Pt5Line12_DateofBirth[0]")
              .setText(
                dateFormatter(
                  user.data.application.marriages_names[0]
                    .marriagedatespouses_name
                )
              );
          }

          // Date of marriage to prior spouse

          // const adzabaaabb = user.data.application.marriages_names[0].marriagedatespouse_name;
          // if (Array.isArray(adzabaaabb) && adzabaaabb.length) {
          // 	const adzab = new Date(adzabaaabb[0]);
          // 	if (isNaN(adzab) || !adzab) adzab = new Date();
          // 	let date_to_fillooo = (adzab.getMonth() < 9 && '0' || '') + (adzab.getMonth() + 1) + '/';
          // 	date_to_fillooo += (adzab.getDate() < 10 && '0' || '') + adzab.getDate() + '/' + adzab.getFullYear();
          // 	form.getTextField('form1[0].#subform[7].Pt5Line13_Date[0]').setText(date_to_fillooo.toLocaleString());
          // }

          if (
            user.data.application.marriages_names[0].marriagedatespouse_name
          ) {
            form
              .getTextField("form1[0].#subform[7].Pt5Line13_Date[0]")
              .setText(
                dateFormatter(
                  user.data.application.marriages_names[0]
                    .marriagedatespouse_name
                )
              );
          }

          // City or town

          if (
            user.data.application.marriages_names[0]
              .marriagetopriortownspouse_name
          ) {
            form
              .getTextField("form1[0].#subform[7].Pt5Line14a_CityTown[0]")
              .setText(
                user.data.application.marriages_names[0].marriagetopriortownspouse_name?.toUpperCase()
              );
          }

          // State or province

          if (
            user.data.application.marriages_names[0]
              .marriagetopriorprovince_name
          ) {
            form
              .getTextField("form1[0].#subform[7].Pt5Line14b_State[0]")
              .setText(
                user.data.application.marriages_names[0].marriagetopriorprovince_name?.toUpperCase()
              );
          }

          // Country

          if (
            user.data.application.marriages_names[0]
              .marriagetopriorcountry_name
          ) {
            form
              .getTextField("form1[0].#subform[7].Pt5Line14c_Country[0]")
              .setText(
                user.data.application.marriages_names[0].marriagetopriorcountry_name?.toUpperCase()
              );
          }

          // Date of marriage to prior spouse

          // const adzabsaaacc = user.data.application.marriages_names[0].marriagespousesdateofbirth_name;
          // if (Array.isArray(adzabsaaacc) && adzabsaaacc.length) {
          // 	const adzabs = new Date(adzabsaaacc[0]);
          // 	if (isNaN(adzabs) || !adzabs) adzabs = new Date();
          // 	let date_to_fillqw = (adzabs.getMonth() < 9 && '0' || '') + (adzabs.getMonth() + 1) + '/';
          // 	date_to_fillqw += (adzabs.getDate() < 10 && '0' || '') + adzabs.getDate() + '/' + adzabs.getFullYear();
          // 	form.getTextField('form1[0].#subform[7].Pt5Line15_Date[0]').setText(date_to_fillqw.toLocaleString());
          // }

          if (
            user.data.application.marriages_names[0]
              .marriagespousesdateofbirth_name
          ) {
            form
              .getTextField("form1[0].#subform[7].Pt5Line15_Date[0]")
              .setText(
                dateFormatter(
                  user.data.application.marriages_names[0]
                    .marriagespousesdateofbirth_name
                )
              );
          }

          // City or town

          if (
            user.data.application.marriages_names[0]
              .marriagelegallyendedtown_name
          ) {
            form
              .getTextField("form1[0].#subform[7].Pt5Line16a_CityTown[0]")
              .setText(
                user.data.application.marriages_names[0].marriagelegallyendedtown_name?.toUpperCase()
              );
          }

          // State or province

          if (
            user.data.application.marriages_names[0]
              .marriagelegallyendedstate_name
          ) {
            form
              .getTextField("form1[0].#subform[7].Pt5Line16b_State[0]")
              .setText(
                user.data.application.marriages_names[0].marriagelegallyendedstate_name?.toUpperCase()
              );
          }

          // Country

          if (
            user.data.application.marriages_names[0]
              .marriagelegallyendedcontry_name
          ) {
            form
              .getTextField("form1[0].#subform[7].Pt5Line16c_Country[0]")
              .setText(
                user.data.application.marriages_names[0].marriagelegallyendedcontry_name?.toUpperCase()
              );
          }
        }
      }

      if (user.data.application.recentstreet_name) {
        form
          .getTextField("form1[0].#subform[4].Pt3Line9_StreetNumberName[0]")
          .setText(user.data.application.recentstreet_name?.toUpperCase());
      }

      if (user.data.application.recentapt_name == "14") {
        form.getCheckBox("form1[0].#subform[4].Pt3Line9_Unit[0]").check();
      } else {
        form.getCheckBox("form1[0].#subform[4].Pt3Line9_Unit[0]").uncheck();
      }
      if (user.data.application.recentapt_name == "12") {
        form.getCheckBox("form1[0].#subform[4].Pt3Line9_Unit[1]").check();
      } else {
        form.getCheckBox("form1[0].#subform[4].Pt3Line9_Unit[1]").uncheck();
      }
      if (user.data.application.recentapt_name == "13") {
        form.getCheckBox("form1[0].#subform[4].Pt3Line9_Unit[2]").check();
      } else {
        form.getCheckBox("form1[0].#subform[4].Pt3Line9_Unit[2]").uncheck();
      }

      if (user.data.application.recentste_name) {
        form
          .getTextField("form1[0].#subform[4].Pt3Line9_AptSteFlrNumber[0]")
          .setText(user.data.application.recentste_name?.toUpperCase());
      }

      if (user.data.application.recentcity_name) {
        form
          .getTextField("form1[0].#subform[4].Pt3Line9_CityOrTown[0]")
          .setText(user.data.application.recentcity_name?.toUpperCase());
      }

      if (user.data.application.recentprovince_name) {
        form
          .getTextField("form1[0].#subform[4].Pt3Line9_Province[0]")
          .setText(user.data.application.recentprovince_name?.toUpperCase());
      }

      if (user.data.application.recentpostal_name) {
        form
          .getTextField("form1[0].#subform[4].Pt3Line9_PostalCode[0]")
          .setText(user.data.application.recentpostal_name?.toUpperCase());
      }

      if (user.data.application.recentcountry_name) {
        form
          .getTextField("form1[0].#subform[4].Pt3Line9_Country[0]")
          .setText(user.data.application.recentcountry_name?.toUpperCase());
      }

      // const vfrdsadad = user.data.application.recenmoveint_name;
      // if (Array.isArray(vfrdsadad) && vfrdsadad.length) {
      // 	const vfrrfvvfr = new Date(vfrdsadad[0]);
      // 	if (isNaN(vfrrfvvfr) || !vfrrfvvfr) vfrrfvvfr = new Date();
      // 	let date_to_fillwe = (vfrrfvvfr.getMonth() < 9 && '0' || '') + (vfrrfvvfr.getMonth() + 1) + '/';
      // 	date_to_fillwe += (vfrrfvvfr.getDate() < 10 && '0' || '') + vfrrfvvfr.getDate() + '/' + vfrrfvvfr.getFullYear();
      // 	form.getTextField('form1[0].#subform[4].Pt3Line10a_DateFrom[0]').setText(date_to_fillwe.toLocaleString());
      // }

      if (user.data.application.recenmoveint_name) {
        form
          .getTextField("form1[0].#subform[4].Pt3Line10a_DateFrom[0]")
          .setText(dateFormatter(user.data.application.recenmoveint_name));
      }

      // const xswwsxaaa = user.data.application.recentmoveout_name;
      // if (Array.isArray(xswwsxaaa) && xswwsxaaa.length) {
      // 	const xswwsx = new Date(xswwsxaaa[0]);
      // 	if (isNaN(xswwsx) || !xswwsx) xswwsx = new Date();
      // 	let date_to_filler = (xswwsx.getMonth() < 9 && '0' || '') + (xswwsx.getMonth() + 1) + '/';
      // 	date_to_filler += (xswwsx.getDate() < 10 && '0' || '') + xswwsx.getDate() + '/' + xswwsx.getFullYear();
      // 	form.getTextField('form1[0].#subform[4].Pt3Line10a_DateTo[0]').setText(date_to_filler.toLocaleString());
      // }

      if (user.data.application.recentmoveout_name) {
        form
          .getTextField("form1[0].#subform[4].Pt3Line10a_DateTo[0]")
          .setText(dateFormatter(user.data.application.recenmoveint_name));
      }

      // Does jerry have any children?

      if (user.data.application.name) {
        form.getCheckBox("form1[0].#subform[7].Pt6Line6_YesNo[1]").check();
      }

      if (user.data.application.name) {
        form.getCheckBox("form1[0].#subform[8].Pt6Line16_YesNo[1]").check();
      }

      if (user.data.application.name) {
        form.getCheckBox("form1[0].#subform[7].Pt6Line11_YesNo[1]").check();
      }

      // Child

      if (Array.isArray(user.data.application.children_names)) {
        if (user.data.application.children_names.length > 0) {
          if (
            user.data.application.children_names[0].childscurrentfamily_name
          ) {
            form
              .getTextField("form1[0].#subform[7].Pt6Line2a_FamilyName[0]")
              .setText(
                user.data.application.children_names[0].childscurrentfamily_name?.toUpperCase()
              );
          }

          if (user.data.application.children_names[0].childscurrent_name) {
            form
              .getTextField("form1[0].#subform[7].Pt6Line2b_GivenName[0]")
              .setText(
                user.data.application.children_names[0].childscurrent_name?.toUpperCase()
              );
          }

          if (
            user.data.application.children_names[0].childscurrentmiddele_name
          ) {
            form
              .getTextField("form1[0].#subform[7].Pt6Line2c_MiddleName[0]")
              .setText(
                user.data.application.children_names[0].childscurrentmiddele_name?.toUpperCase()
              );
          }

          // const lklkkllklj = user.data.application.children_names[0].childscurrentdatefobirth_name;
          // if (Array.isArray(lklkkllklj) && lklkkllklj.length) {
          // 	const ghj = new Date(lklkkllklj[0]);
          // 	if (isNaN(ghj) || !ghj) ghj = new Date();
          // 	let date_to_fill = (ghj.getMonth() < 9 && '0' || '') + (ghj.getMonth() + 1) + '/';
          // 	date_to_fill += (ghj.getDate() < 10 && '0' || '') + ghj.getDate() + '/' + ghj.getFullYear();
          // 	form.getTextField('form1[0].#subform[7].Pt6Line4_DateofBirth[0]').setText(date_to_fill.toLocaleString());
          // }

          const lklkkllklj =
            user.data.application.children_names[0]
              .childscurrentdatefobirth_name;
          if (
            user.data.application.children_names[0]
              .childscurrentdatefobirth_name
          ) {
            form
              .getTextField("form1[0].#subform[7].Pt6Line4_DateofBirth[0]")
              .setText(
                dateFormatter(
                  user.data.application.children_names[0]
                    .childscurrentdatefobirth_name
                )
              );
          }

          if (
            user.data.application.children_names[0]
              .childscurrentcountryofbirth_name
          ) {
            form
              .getTextField("form1[0].#subform[7].Pt6Line6_Country[0]")
              .setText(
                user.data.application.children_names[0].childscurrentcountryofbirth_name?.toUpperCase()
              );
          }

          if (
            user.data.application.children_names[0].childscurrentanumber_name
          ) {
            form
              .getTextField("form1[0].#subform[7].Pt6Line3_AlienNumber[0]")
              .setText(
                user.data.application.children_names[0].childscurrentanumber_name?.toUpperCase()
              );
          }
        }

        if (user.data.application.children_names.length > 1) {
          // Child 2

          if (
            user.data.application.children_names[1].childscurrentfamily_name
          ) {
            form
              .getTextField("form1[0].#subform[7].Pt6Line7a_FamilyName[0]")
              .setText(
                user.data.application.children_names[1].childscurrentfamily_name?.toUpperCase()
              );
          }

          if (user.data.application.children_names[1].childscurrent_name) {
            form
              .getTextField("form1[0].#subform[7].Pt6Line7b_GivenName[0]")
              .setText(
                user.data.application.children_names[1].childscurrent_name?.toUpperCase()
              );
          }

          if (
            user.data.application.children_names[1].childscurrentmiddele_name
          ) {
            form
              .getTextField("form1[0].#subform[7].Pt6Line7c_MiddleName[0]")
              .setText(
                user.data.application.children_names[1].childscurrentmiddele_name?.toUpperCase()
              );
          }

          // const ghjxfffff = user.data.application.children_names[1].childscurrentdatefobirth_name;
          // if (Array.isArray(ghjxfffff) && ghjxfffff.length) {
          // 	const ghjx = new Date(ghjxfffff[0]);
          // 	if (isNaN(ghjx) || !ghjx) ghjx = new Date();
          // 	let date_to_fillrt = (ghjx.getMonth() < 9 && '0' || '') + (ghjx.getMonth() + 1) + '/';
          // 	date_to_fillrt += (ghjx.getDate() < 10 && '0' || '') + ghjx.getDate() + '/' + ghjx.getFullYear();
          // 	form.getTextField('form1[0].#subform[7].Pt6Line9_DateofBirth[0]').setText(date_to_fillrt.toLocaleString());
          // }

          if (
            user.data.application.children_names[1]
              .childscurrentdatefobirth_name
          ) {
            form
              .getTextField("form1[0].#subform[7].Pt6Line9_DateofBirth[0]")
              .setText(
                dateFormatter(
                  user.data.application.children_names[1]
                    .childscurrentdatefobirth_name
                )
              );
          }

          if (
            user.data.application.children_names[1]
              .childscurrentcountryofbirth_name
          ) {
            form
              .getTextField("form1[0].#subform[7].Pt6Line10_Country[0]")
              .setText(
                user.data.application.children_names[1].childscurrentcountryofbirth_name?.toUpperCase()
              );
          }

          if (
            user.data.application.children_names[1].childscurrentanumber_name
          ) {
            form
              .getTextField("form1[0].#subform[7].Pt6Line8_AlienNumber[0]")
              .setText(
                user.data.application.children_names[1].childscurrentanumber_name?.toUpperCase()
              );
          }
        }

        // Child 3

        if (user.data.application.children_names.length > 2) {
          if (
            user.data.application.children_names[2].childscurrentfamily_name
          ) {
            form
              .getTextField("form1[0].#subform[8].Pt6Line12a_FamilyName[0]")
              .setText(
                user.data.application.children_names[2].childscurrentfamily_name?.toUpperCase()
              );
          }

          if (user.data.application.children_names[2].childscurrent_name) {
            form
              .getTextField("form1[0].#subform[8].Pt6Line12b_GivenName[0]")
              .setText(
                user.data.application.children_names[2].childscurrent_name?.toUpperCase()
              );
          }

          if (
            user.data.application.children_names[2].childscurrentmiddele_name
          ) {
            form
              .getTextField("form1[0].#subform[8].Pt6Line12c_MiddleName[0]")
              .setText(
                user.data.application.children_names[2].childscurrentmiddele_name?.toUpperCase()
              );
          }

          // const ghjzjjj = user.data.application.children_names[2].childscurrentdatefobirth_name;
          // if (Array.isArray(ghjzjjj) && ghjzjjj.length) {
          // 	const ghjz = new Date(ghjzjjj[0]);
          // 	if (isNaN(ghjz) || !ghjz) ghjz = new Date();
          // 	let date_to_fillty = (ghjz.getMonth() < 9 && '0' || '') + (ghjz.getMonth() + 1) + '/';
          // 	date_to_fillty += (ghjz.getDate() < 10 && '0' || '') + ghjz.getDate() + '/' + ghjz.getFullYear();
          // 	form.getTextField('form1[0].#subform[8].Pt6Line14_DateofBirth[0]').setText(date_to_fillty.toLocaleString());
          // }

          if (
            user.data.application.children_names[2]
              .childscurrentdatefobirth_name
          ) {
            form
              .getTextField("form1[0].#subform[8].Pt6Line14_DateofBirth[0]")
              .setText(
                dateFormatter(
                  user.data.application.children_names[2]
                    .childscurrentdatefobirth_name
                )
              );
          }

          if (
            user.data.application.children_names[2]
              .childscurrentcountryofbirth_name
          ) {
            form
              .getTextField("form1[0].#subform[8].Pt6Line15_Country[0]")
              .setText(
                user.data.application.children_names[2].childscurrentcountryofbirth_name?.toUpperCase()
              );
          }

          if (
            user.data.application.children_names[2].childscurrentanumber_name
          ) {
            form
              .getTextField("form1[0].#subform[8].Pt6Line13_AlienNumber[0]")
              .setText(
                user.data.application.children_names[2].childscurrentanumber_name?.toUpperCase()
              );
          }
        }
      }

      // EMPLOYER 1

      if (Array.isArray(user.data.application.employerone_names)) {
        if (user.data.application.employerone_names.length > 0) {
          // Name of employer or company

          if (user.data.application.employerone_names[0].employer_name) {
            form
              .getTextField("form1[0].#subform[4].Pt3Line11_EmployerName[0]")
              .setText(
                user.data.application.employerone_names[0].employer_name
              );
          }

          // Street number and name

          if (
            user.data.application.employerone_names[0].empmailingnumber_name
          ) {
            form
              .getTextField(
                "form1[0].#subform[4].Pt3Line12_StreetNumberName[0]"
              )
              .setText(
                user.data.application.employerone_names[0].empmailingnumber_name
                  ?.toUpperCase()
                  ?.slice(0, 25)
              );
          }

          // Apt./Ste./Flr. Number (if any)

          if (
            user.data.application.employerone_names[0].asfnumberus_name ==
            "Apt"
          ) {
            form
              .getCheckBox("form1[0].#subform[4].Pt3Line12_Unit[0]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[4].Pt3Line12_Unit[0]")
              .uncheck();
          }

          if (
            user.data.application.employerone_names[0].asfnumberus_name ==
            "Ste"
          ) {
            form
              .getCheckBox("form1[0].#subform[4].Pt3Line12_Unit[1]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[4].Pt3Line12_Unit[1]")
              .uncheck();
          }

          if (
            user.data.application.employerone_names[0].asfnumberus_name ==
            "Flr"
          ) {
            form
              .getCheckBox("form1[0].#subform[4].Pt3Line12_Unit[2]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[4].Pt3Line12_Unit[2]")
              .uncheck();
          }

          if (user.data.application.employerone_names[0].ssste_name) {
            form
              .getTextField(
                "form1[0].#subform[4].Pt3Line12_AptSteFlrNumber[0]"
              )
              .setText(
                user.data.application.employerone_names[0].ssste_name?.toUpperCase()
              );
          }

          // City or town

          if (
            user.data.application.employerone_names[0]
              .previousfuturecityemployment_name
          ) {
            form
              .getTextField("form1[0].#subform[4].Pt3Line12_CityOrTown[0]")
              .setText(
                user.data.application.employerone_names[0].previousfuturecityemployment_name?.toUpperCase()
              );
          }

          // State

          if (
            user.data.application.employerone_names[0]
              .previousfuturestateemployment_name
          ) {
            form
              .getDropdown("form1[0].#subform[4].Pt3Line12_State[0]")
              .select(
                user.data.application.employerone_names[0].previousfuturestateemployment_name?.toUpperCase()
              );
          }

          // Province

          if (
            user.data.application.employerone_names[0].employmentstate_name
          ) {
            form
              .getTextField("form1[0].#subform[4].Pt3Line12_Province[0]")
              .setText(
                user.data.application.employerone_names[0].employmentstate_name?.toUpperCase()
              );
          }

          // ZIP Code

          if (user.data.application.employerone_names[0].employmentzip_name) {
            form
              .getTextField("form1[0].#subform[4].Pt3Line12_ZipCode[0]")
              .setText(
                user.data.application.employerone_names[0].employmentzip_name?.toUpperCase()
              );
          }

          // jerry's Occupation

          if (user.data.application.employerone_names[0].occupationus_name) {
            form
              .getTextField("form1[0].#subform[4].Pt3Line13_EmployerName[0]")
              .setText(
                user.data.application.employerone_names[0].occupationus_name
                  ?.toUpperCase()
                  .slice(0, 34)
              );
          }

          // Postal code

          if (
            user.data.application.employerone_names[0].employmentpostal_name
          ) {
            form
              .getTextField("form1[0].#subform[4].Pt3Line12_PostalCode[0]")
              .setText(
                user.data.application.employerone_names[0].employmentpostal_name?.toUpperCase()
              );
          }

          // Country

          if (
            user.data.application.employerone_names[0].countryemployment_name
          ) {
            form
              .getTextField("form1[0].#subform[4].Pt3Line12_Country[0]")
              .setText(
                user.data.application.employerone_names[0].countryemployment_name?.toUpperCase()
              );
          }

          // Employment start getDate

          // const aghjztyt = user.data.application.employerone_names[0].employment_name;
          // if (Array.isArray(aghjztyt) && aghjztyt.length) {
          // 	const aghjz = new Date(aghjztyt[0]);
          // 	if (isNaN(aghjz) || !aghjz) aghjz = new Date();
          // 	let date_to_fillty = (aghjz.getMonth() < 9 && '0' || '') + (aghjz.getMonth() + 1) + '/';
          // 	date_to_fillty += (aghjz.getDate() < 10 && '0' || '') + aghjz.getDate() + '/' + aghjz.getFullYear();
          // 	form.getTextField('form1[0].#subform[5].Pt3Line14a_DateFrom[0]').setText(date_to_fillty.toLocaleString());
          // }

          if (user.data.application.employerone_names[0].employment_name) {
            form
              .getTextField("form1[0].#subform[5].Pt3Line14a_DateFrom[0]")
              .setText(
                dateFormatter(
                  user.data.application.employerone_names[0].employment_name
                )
              );
          }

          // Employment end date

          // const ghjzaytyty = user.data.application.employerone_names[0].currentemployment_name;
          // if (Array.isArray(ghjzaytyty) && ghjzaytyty.length) {
          // 	const ghjza = new Date(ghjzaytyty[0]);
          // 	if (isNaN(ghjza) || !ghjza) ghjza = new Date();
          // 	let date_to_fillyu = (ghjza.getMonth() < 9 && '0' || '') + (ghjza.getMonth() + 1) + '/';
          // 	date_to_fillyu += (ghjza.getDate() < 10 && '0' || '') + ghjza.getDate() + '/' + ghjza.getFullYear();
          // 	form.getTextField('form1[0].#subform[5].Pt3Line14b_DateTo[0]').setText(date_to_fillyu.toLocaleString());
          // }

          // if (
          //   user.data.application.employerone_names[0].currentemployment_name
          // ) {
          //   form
          //     .getTextField("form1[0].#subform[5].Pt3Line14b_DateTo[0]")
          //     .setText(
          //       dateFormatter(
          //         user.data.application.employerone_names[0]
          //           .currentemployment_name
          //       )
          //     );
          // }
        }

        // ---------------------------------------------------------------------------------------------------------------------------------------------------------

        if (user.data.application.employerone_names.length > 1) {
          // EMPLOYER 2

          if (user.data.application.employerone_names[1].employer_name) {
            form
              .getTextField("form1[0].#subform[5].Pt3Line4a_EmployerName[0]")
              .setText(
                user.data.application.employerone_names[1].employer_name
                  ?.toUpperCase()
                  ?.slice(0, 34)
              );
          }

          // Street number and name

          if (
            user.data.application.employerone_names[1].empmailingnumber_name
          ) {
            form
              .getTextField(
                "form1[0].#subform[5].Pt3Line16_StreetNumberName[0]"
              )
              .setText(
                user.data.application.employerone_names[1].empmailingnumber_name
                  ?.toUpperCase()
                  ?.slice(0, 25)
              );
          }

          // Apt./Ste./Flr. Number (if any)

          if (
            user.data.application.employerone_names[1].asfnumberus_name ==
            "Apt"
          ) {
            form
              .getCheckBox("form1[0].#subform[5].Pt3Line16_Unit[0]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[5].Pt3Line16_Unit[0]")
              .uncheck();
          }

          if (
            user.data.application.employerone_names[1].asfnumberus_name ==
            "Ste"
          ) {
            form
              .getCheckBox("form1[0].#subform[5].Pt3Line16_Unit[1]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[5].Pt3Line16_Unit[1]")
              .uncheck();
          }

          if (
            user.data.application.employerone_names[1].asfnumberus_name ==
            "Flr"
          ) {
            form
              .getCheckBox("form1[0].#subform[5].Pt3Line16_Unit[2]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[5].Pt3Line16_Unit[2]")
              .uncheck();
          }

          if (user.data.application.employerone_names[1].ssste_name) {
            form
              .getTextField(
                "form1[0].#subform[5].Pt3Line16_AptSteFlrNumber[0]"
              )
              .setText(user.data.application.employerone_names[1].ssste_name);
          }

          // City or town

          if (
            user.data.application.employerone_names[1]
              .previousfuturecityemployment_name
          ) {
            form
              .getTextField("form1[0].#subform[5].Pt3Line16_CityOrTown[0]")
              .setText(
                user.data.application.employerone_names[1].previousfuturecityemployment_name?.toUpperCase()
              );
          }

          // State

          if (
            user.data.application.employerone_names[1]
              .previousfuturestateemployment_name
          ) {
            form
              .getDropdown("form1[0].#subform[5].Pt3Line16_State[0]")
              .select(
                user.data.application.employerone_names[1].previousfuturestateemployment_name?.toUpperCase()
              );
          }

          // jerry's Occupation

          if (user.data.application.employerone_names[1].occupationus_name) {
            form
              .getTextField("form1[0].#subform[5].Pt3Line17_EmployerName[0]")
              .setText(
                user.data.application.employerone_names[1].occupationus_name?.toUpperCase()
              );
          }

          // Province

          if (
            user.data.application.employerone_names[1].employmentstate_name
          ) {
            form
              .getTextField("form1[0].#subform[5].Pt3Line16_Province[0]")
              .setText(
                user.data.application.employerone_names[1].employmentstate_name?.toUpperCase()
              );
          }

          // ZIP Code

          if (user.data.application.employerone_names[1].employmentzip_name) {
            form
              .getTextField("form1[0].#subform[5].Pt3Line16_ZipCode[0]")
              .setText(
                user.data.application.employerone_names[1].employmentzip_name?.toUpperCase()
              );
          }

          // Postal code

          if (
            user.data.application.employerone_names[1].employmentpostal_name
          ) {
            form
              .getTextField("form1[0].#subform[5].Pt3Line16_PostalCode[0]")
              .setText(
                user.data.application.employerone_names[1].employmentpostal_name?.toUpperCase()
              );
          }

          // Country

          if (
            user.data.application.employerone_names[1].countryemployment_name
          ) {
            form
              .getTextField("form1[0].#subform[5].Pt3Line16_Country[0]")
              .setText(
                user.data.application.employerone_names[1].countryemployment_name?.toUpperCase()
              );
          }

          // Employment start date

          // const asddfgsadasd = user.data.application.employerone_names[1].employment_name;
          // if (Array.isArray(asddfgsadasd) && asddfgsadasd.length) {
          // 	const asddfg = new Date(asddfgsadasd[0]);
          // 	if (isNaN(asddfg) || !asddfg) asddfg = new Date();
          // 	let date_to_fillui = (asddfg.getMonth() < 9 && '0' || '') + (asddfg.getMonth() + 1) + '/';
          // 	date_to_fillui += (asddfg.getDate() < 10 && '0' || '') + asddfg.getDate() + '/' + asddfg.getFullYear();
          // 	form.getTextField('form1[0].#subform[5].Pt3Line18a_DateFrom[0]').setText(date_to_fillui.toLocaleString());

          // }

          if (user.data.application.employerone_names[1].employment_name) {
            form
              .getTextField("form1[0].#subform[5].Pt3Line18a_DateFrom[0]")
              .setText(
                dateFormatter(
                  user.data.application.employerone_names[1].employment_name
                )
              );
          }

          // Employment end date

          // const ghcvoooo = user.data.application.employerone_names[1].currentemployment_name;
          // if (Array.isArray(ghcvoooo) && ghcvoooo.length) {
          // 	const ghcv = new Date(ghcvoooo[0]);
          // 	if (isNaN(ghcv) || !ghcv) ghcv = new Date();
          // 	let date_to_fillio = (ghcv.getMonth() < 9 && '0' || '') + (ghcv.getMonth() + 1) + '/';
          // 	date_to_fillio += (ghcv.getDate() < 10 && '0' || '') + ghcv.getDate() + '/' + ghcv.getFullYear();
          // 	form.getTextField('form1[0].#subform[5].Pt3Line18a_DateTo[0]').setText(date_to_fillio.toLocaleString());
          // }

          if (
            user.data.application.employerone_names[1].currentemployment_name
          ) {
            form
              .getTextField("form1[0].#subform[5].Pt3Line18a_DateTo[0]")
              .setText(
                dateFormatter(
                  user.data.application.employerone_names[1]
                    .currentemployment_name
                )
              );
          }
        }

        if (user.data.application.employerone_names.length > 2) {
          // EMPLOYER 3

          if (user.data.application.employerone_names[2].employer_name) {
            form
              .getTextField("form1[0].#subform[5].Pt3Line19_EmployerName[0]")
              .setText(
                user.data.application.employerone_names[2].employer_name?.toUpperCase()
              );
          }

          // Street number and name

          if (
            user.data.application.employerone_names[2].empmailingnumber_name
          ) {
            form
              .getTextField(
                "form1[0].#subform[5].Pt3Line20_StreetNumberName[0]"
              )
              .setText(
                user.data.application.employerone_names[2].empmailingnumber_name?.toUpperCase()
              );
          }

          // Apt./Ste./Flr. Number (if any)

          if (
            user.data.application.employerone_names[2].asfnumberus_name ==
            "Apt"
          ) {
            form
              .getCheckBox("form1[0].#subform[5].Pt3Line20_Unit[0]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[5].Pt3Line20_Unit[0]")
              .uncheck();
          }

          if (
            user.data.application.employerone_names[2].asfnumberus_name ==
            "Ste"
          ) {
            form
              .getCheckBox("form1[0].#subform[5].Pt3Line20_Unit[1]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[5].Pt3Line20_Unit[1]")
              .uncheck();
          }

          if (
            user.data.application.employerone_names[2].asfnumberus_name ==
            "Flr"
          ) {
            form
              .getCheckBox("form1[0].#subform[5].Pt3Line20_Unit[2]")
              .check();
          } else {
            form
              .getCheckBox("form1[0].#subform[5].Pt3Line20_Unit[2]")
              .uncheck();
          }

          if (user.data.application.employerone_names[2].ssste_name) {
            form
              .getTextField(
                "form1[0].#subform[5].Pt3Line20_AptSteFlrNumber[0]"
              )
              .setText(user.data.application.employerone_names[1].ssste_name);
          }

          // City or town

          if (
            user.data.application.employerone_names[2]
              .previousfuturecityemployment_name
          ) {
            form
              .getTextField("form1[0].#subform[5].Pt3Line20_CityOrTown[0]")
              .setText(
                user.data.application.employerone_names[2].previousfuturecityemployment_name?.toUpperCase()
              );
          }

          // State

          if (
            user.data.application.employerone_names[2]
              .previousfuturestateemployment_name
          ) {
            form
              .getDropdown("form1[0].#subform[5].Pt3Line20_State[0]")
              .select(
                user.data.application.employerone_names[2].previousfuturestateemployment_name?.toUpperCase()
              );
          }

          // jerry's Occupation

          if (user.data.application.employerone_names[2].occupationus_name) {
            form
              .getTextField("form1[0].#subform[5].Pt3Line20_EmployerName[0]")
              .setText(
                user.data.application.employerone_names[2].occupationus_name?.toUpperCase()
              );
          }

          // Province

          if (
            user.data.application.employerone_names[2].employmentstate_name
          ) {
            form
              .getTextField("form1[0].#subform[5].Pt3Line20_Province[0]")
              .setText(
                user.data.application.employerone_names[2].employmentstate_name?.toUpperCase()
              );
          }
          // ZIP Code

          if (user.data.application.employerone_names[2].employmentzip_name) {
            form
              .getTextField("form1[0].#subform[5].Pt3Line20_ZipCode[0]")
              .setText(
                user.data.application.employerone_names[2].employmentzip_name?.toUpperCase()
              );
          }
          // Postal code

          if (
            user.data.application.employerone_names[2].employmentpostal_name
          ) {
            form
              .getTextField("form1[0].#subform[5].Pt3Line20_PostalCode[0]")
              .setText(
                user.data.application.employerone_names[2].employmentpostal_name?.toUpperCase()
              );
          }

          // Country

          if (
            user.data.application.employerone_names[2].countryemployment_name
          ) {
            form
              .getTextField("form1[0].#subform[5].Pt3Line20_Country[0]")
              .setText(
                user.data.application.employerone_names[2].countryemployment_name?.toUpperCase()
              );
          }

          // Employment start date

          // const asjzyhn = user.data.application.employerone_names[2].employment_name;
          // if (Array.isArray(asjzyhn) && asjzyhn.length) {
          // 	const asjz = new Date(asjzyhn[0]);
          // 	if (isNaN(asjz) || !asjz) asjz = new Date();
          // 	let date_to_fillas = (asjz.getMonth() < 9 && '0' || '') + (asjz.getMonth() + 1) + '/';
          // 	date_to_fillas += (asjz.getDate() < 10 && '0' || '') + asjz.getDate() + '/' + asjz.getFullYear();
          // 	form.getTextField('form1[0].#subform[5].Pt3Line22a_DateFrom[0]').setText(date_to_fillas.toLocaleString());

          // }

          if (user.data.application.employerone_names[2].employment_name) {
            form
              .getTextField("form1[0].#subform[5].Pt3Line22a_DateFrom[0]")
              .setText(
                dateFormatter(
                  user.data.application.employerone_names[2].employment_name
                )
              );
          }

          // Employment end date

          // const dfzaasdda = user.data.application.employerone_names[2].currentemployment_name;
          // if (Array.isArray(dfzaasdda) && dfzaasdda.length) {
          // 	const dfza = new Date(dfzaasdda[0]);
          // 	if (isNaN(dfza) || !dfza) dfza = new Date();
          // 	let date_to_fillsd = (dfza.getMonth() < 9 && '0' || '') + (dfza.getMonth() + 1) + '/';
          // 	date_to_fillsd += (dfza.getDate() < 10 && '0' || '') + dfza.getDate() + '/' + dfza.getFullYear();
          // 	form.getTextField('form1[0].#subform[5].Pt3Line22a_DateTo[0]').setText(date_to_fillsd.toLocaleString());
          // }

          if (
            user.data.application.employerone_names[2].currentemployment_name
          ) {
            form
              .getTextField("form1[0].#subform[5].Pt3Line22a_DateTo[0]")
              .setText(
                dateFormatter(
                  user.data.application.employerone_names[2]
                    .currentemployment_name
                )
              );
          }
        }
      }

      // Places lived

      // About jerry's mailing address inside the U.S.

      //In care of name (if any)

      // if (user.data.application.mailing_name) {
      //   form.getTextField('form1[0].#subform[1].Pt1Line13_InCareofName[0]').setText(user.data.application.mailing_name?.toUpperCase());
      // }

      // if (user.data.application.insideusaddress_name) {
      //   form.getTextField('form1[0].#subform[4].Pt3Line5_Country[0]').setText(user.data.application.insideusaddress_name?.toUpperCase());
      // }

      // --------------------------------------------------------------------------------------------------------------------------------

      // physical address inside the U.S.

      if (user.data.application.mailingaddressus_name === "no") {
        if (user.data.application.insideusnumber_name) {
          console.log(user.data.application.insideusnumber_name);
          form
            .getTextField("form1[0].#subform[4].Pt3Line5_StreetNumberName[0]")
            .setText(
              user.data.application.insideusnumber_name?.toUpperCase()
            );
        }

        if (user.data.application.usifanyselest_name) {
          form
            .getTextField("form1[0].#subform[4].Pt3Line5_AptSteFlrNumber[0]")
            .setText(user.data.application.usifanyselest_name);
        }

        if (user.data.application.insideusifany_name == "Apt") {
          form.getCheckBox("form1[0].#subform[4].Pt3Line5_Unit[2]").check();
        }
        if (user.data.application.insideusifany_name == "Ste") {
          form.getCheckBox("form1[0].#subform[4].Pt3Line5_Unit[1]").check();
        }

        if (user.data.application.insideusifany_name == "Flr") {
          form.getCheckBox("form1[0].#subform[4].Pt3Line5_Unit[0]").check();
        }

        if (user.data.application.insideusaddress_name) {
          form
            .getTextField("form1[0].#subform[4].Pt3Line5_Country[0]")
            .setText(
              user.data.application.insideusaddress_name?.toUpperCase()
            );
        }

        if (user.data.application.insideusgcity_name) {
          form
            .getTextField("form1[0].#subform[4].Pt3Line5_CityOrTown[0]")
            .setText(user.data.application.insideusgcity_name?.toUpperCase());
        }

        console.log(user.data.application.insideusgcity_name);
        // if (user.data.application.childscurrentcountryofbirth_name) {
        //   form.getTextField('form1[0].#subform[4].Pt3Line5_Province[0]').setText(user.data.application.childscurrentcountryofbirth_name?.toUpperCase());
        // }

        // if (user.data.application.childscurrentcountryofbirth_name) {
        //   form.getTextField('form1[0].#subform[4].Pt3Line5_PostalCode[0]').setText(user.data.application.childscurrentcountryofbirth_name?.toUpperCase());
        // }

        if (user.data.application.insideuscode_name) {
          form
            .getTextField("form1[0].#subform[4].Pt3Line5_ZipCode[0]")
            .setText(user.data.application.insideuscode_name?.toUpperCase());
        }

        if (user.data.application.insideusstate_name) {
          form
            .getDropdown("form1[0].#subform[4].Pt3Line5_State[0]")
            .select(user.data.application.insideusstate_name?.toUpperCase());
        }

        if (user.data.application.insideusdate_name) {
          form
            .getTextField("form1[0].#subform[4].Pt3Line6a_Date[0]")
            .setText(dateFormatter(user.data.application.insideusdate_name));
        }
      }
      // -------------------------------------------------------------------------------------------------------------------------------------------------------------

      // mailing address inside the U.S.

      if (user.data.application.mailingaddressus_name !== "no") {
        if (user.data.application.mailingnumber_name) {
          form
            .getTextField("form1[0].#subform[4].Pt3Line5_StreetNumberName[0]")
            .setText(user.data.application.mailingnumber_name?.toUpperCase());
        }

        if (user.data.application.usifanyselest_name) {
          form
            .getTextField("form1[0].#subform[4].Pt3Line5_AptSteFlrNumber[0]")
            .setText(user.data.application.usifanyselest_name);
        }

        if (user.data.application.apt_name == "1") {
          form.getCheckBox("form1[0].#subform[4].Pt3Line5_Unit[2]").check();
        }
        if (user.data.application.apt_name == "aptplase") {
          form.getCheckBox("form1[0].#subform[4].Pt3Line5_Unit[1]").check();
        }

        if (user.data.application.apt_name == "flrpalase") {
          form.getCheckBox("form1[0].#subform[4].Pt3Line5_Unit[0]").check();
        }

        if (user.data.application.mailingaddress_name) {
          form
            .getTextField("form1[0].#subform[4].Pt3Line5_Country[0]")
            .setText(
              user.data.application.mailingaddress_name?.toUpperCase()
            );
        }

        if (user.data.application.mailingcity_name) {
          form
            .getTextField("form1[0].#subform[4].Pt3Line5_CityOrTown[0]")
            .setText(user.data.application.mailingcity_name?.toUpperCase());
        }

        // if (user.data.application.childscurrentcountryofbirth_name) {
        //   form.getTextField('form1[0].#subform[4].Pt3Line5_Province[0]').setText(user.data.application.childscurrentcountryofbirth_name?.toUpperCase());
        // }

        // if (user.data.application.childscurrentcountryofbirth_name) {
        //   form.getTextField('form1[0].#subform[4].Pt3Line5_PostalCode[0]').setText(user.data.application.childscurrentcountryofbirth_name?.toUpperCase());
        // }

        if (user.data.application.mailingpostalcode_name) {
          form
            .getTextField("form1[0].#subform[4].Pt3Line5_ZipCode[0]")
            .setText(
              user.data.application.mailingpostalcode_name?.toUpperCase()
            );
        }

        if (user.data.application.insidemailingprovince_name) {
          form
            .getDropdown("form1[0].#subform[4].Pt3Line5_State[0]")
            .select(
              user.data.application.insidemailingprovince_name?.toUpperCase()
            );
        }

        // if (user.data.application.currentphysicaladdressus_name) {
        //   form
        //     .getTextField("form1[0].#subform[4].Pt3Line6a_Date[0]")
        //     .setText(
        //       dateFormatter(
        //         user.data.application.currentphysicaladdressus_name
        //       )
        //     );
        // }
      }

      if (user.data.application.mailing_name) {
        form
          .getTextField("form1[0].#subform[1].Pt1Line12_InCareofName[0]")
          .setText(user.data.application.mailing_name?.toUpperCase());
      }

      if (user.data.application.mailingnumber_name) {
        form
          .getTextField("form1[0].#subform[1].Pt1Line12_StreetNumberName[0]")
          .setText(
            user.data.application.mailingnumber_name
              ?.toUpperCase()
              ?.slice(0, 25)
          );
      }

      // if (user.data.application.usoneyearindate_name) {
      //   form
      //     .getTextField("form1[0].#subform[4].Pt3Line10a_DateFrom[0]")
      //     .setText(dateFormatter(user.data.application.usoneyearindate_name));
      // }

      // if (user.data.application.usoneyearoutdate_name) {
      //   form
      //     .getTextField("form1[0].#subform[4].Pt3Line10a_DateTo[0]")
      //     .setText(
      //       dateFormatter(user.data.application.usoneyearoutdate_name)
      //     );
      // }

      // Apt./Ste./Flr. Number (if any)

      if (user.data.application.apt_name == "aptplase") {
        form.getCheckBox("form1[0].#subform[1].Pt1Line12_Unit[0]").check();
      } else {
        form.getCheckBox("form1[0].#subform[1].Pt1Line12_Unit[0]").uncheck();
      }

      if (user.data.application.apt_name == "steaplase") {
        form.getCheckBox("form1[0].#subform[1].Pt1Line12_Unit[1]").check();
      } else {
        form.getCheckBox("form1[0].#subform[1].Pt1Line12_Unit[1]").uncheck();
      }

      if (user.data.application.apt_name == "flrpalase") {
        form.getCheckBox("form1[0].#subform[1].Pt1Line12_Unit[2]").check();
      } else {
        form.getCheckBox("form1[0].#subform[1].Pt1Line12_Unit[2]").uncheck();
      }

      if (user.data.application.apt_name == "Apt.") {
        form.getCheckBox("form1[0].#subform[1].Pt1Line12_Unit[0]").check();
      } else {
        form.getCheckBox("form1[0].#subform[1].Pt1Line12_Unit[0]").uncheck();
      }

      if (user.data.application.apt_name == "Ste.") {
        form.getCheckBox("form1[0].#subform[1].Pt1Line12_Unit[1]").check();
      } else {
        form.getCheckBox("form1[0].#subform[1].Pt1Line12_Unit[1]").uncheck();
      }

      if (user.data.application.apt_name == "Flr.") {
        form.getCheckBox("form1[0].#subform[1].Pt1Line12_Unit[2]").check();
      } else {
        form.getCheckBox("form1[0].#subform[1].Pt1Line12_Unit[2]").uncheck();
      }

      if (user.data.application.selectste_name) {
        form
          .getTextField("form1[0].#subform[1].Pt1Line12_AptSteFlrNumber[0]")
          .setText(
            user.data.application.selectste_name?.toUpperCase().slice(0, 6)
          );
      }

      if (user.data.application.physicalste_name) {
        form
          .getTextField("form1[0].#subform[1].Pt1Line12_AptSteFlrNumber[0]")
          .setText(
            user.data.application.physicalste_name?.toUpperCase().slice(0, 6)
          );
      }

      // City or town

      if (user.data.application.mailingcity_name) {
        form
          .getTextField("form1[0].#subform[1].Pt1Line12_CityOrTown[0]")
          .setText(user.data.application.mailingcity_name?.toUpperCase());
      }

      // State

      if (user.data.application.insidemailingprovince_name) {
        form
          .getDropdown("form1[0].#subform[1].Pt1Line12_State[0]")
          .select(
            user.data.application.insidemailingprovince_name?.toUpperCase()
          );
      }

      // ZIP code

      if (user.data.application.mailingpostalcode_name) {
        form
          .getTextField("form1[0].#subform[1].Pt1Line12_ZipCode[0]")
          .setText(
            user.data.application.mailingpostalcode_name?.toUpperCase()
          );
      }

      // // Street number and name

      // if (user.data.application.mailingnumber_name) {
      //   form.getTextField('form1[0].#subform[1].Pt1Line13_StreetNumberName[0]').setText(user.data.application.mailingnumber_name?.toUpperCase()?.slice(0, 25));
      // }

      // if (user.data.application.usoneyearindate_name) {
      //   form.getTextField('form1[0].#subform[4].Pt3Line10a_DateFrom[0]').setText(dateFormatter(user.data.application.usoneyearindate_name));
      // }

      // if (user.data.application.usoneyearoutdate_name) {
      //   form.getTextField('form1[0].#subform[4].Pt3Line10a_DateTo[0]').setText(dateFormatter(user.data.application.usoneyearoutdate_name));
      // }

      // // Apt./Ste./Flr. Number (if any)

      // if (user.data.application.apt_name == 'aptplase') {
      //   form.getCheckBox('form1[0].#subform[1].Pt1Line13_Unit[0]').check();
      // } else {
      //   form.getCheckBox('form1[0].#subform[1].Pt1Line13_Unit[0]').uncheck();
      // }

      // if (user.data.application.apt_name == 'steaplase') {
      //   form.getCheckBox('form1[0].#subform[1].Pt1Line13_Unit[1]').check();
      // } else {
      //   form.getCheckBox('form1[0].#subform[1].Pt1Line13_Unit[1]').uncheck();
      // }

      // if (user.data.application.apt_name == 'flrpalase') {
      //   form.getCheckBox('form1[0].#subform[1].Pt1Line13_Unit[2]').check();
      // } else {
      //   form.getCheckBox('form1[0].#subform[1].Pt1Line13_Unit[2]').uncheck();
      // }

      // if (user.data.application.selectste_name) {
      //   form.getTextField('form1[0].#subform[1].Pt1Line13_AptSteFlrNumber[0]').setText(user.data.application.selectste_name?.toUpperCase());
      // }

      // // City or town

      // if (user.data.application.mailingcity_name) {
      //   form.getTextField('form1[0].#subform[1].Pt1Line13_CityOrTown[0]').setText(user.data.application.mailingcity_name?.toUpperCase());
      // }

      // // State

      // if (user.data.application.insidemailingprovince_name) {
      //   form.getDropdown('form1[0].#subform[1].Pt1Line13_State[0]').select(user.data.application.insidemailingprovince_name?.toUpperCase());
      // }

      // // ZIP code

      // if (user.data.application.mailingpostalcode_name) {
      //   form.getTextField('form1[0].#subform[1].Pt1Line13_ZipCode[0]').setText(user.data.application.mailingpostalcode_name?.toUpperCase());
      // }

      // FamilyName

      if (user.data.application.sponsorfamily_name) {
        form
          .getTextField("form1[0].#subform[6].Pt5Line4a_FamilyName[0]")
          .setText(user.data.application.sponsorfamily_name?.toUpperCase());
      }

      // GivenName

      if (user.data.application.sponsorname) {
        form
          .getTextField("form1[0].#subform[6].Pt5Line4b_GivenName[0]")
          .setText(user.data.application.sponsorname?.toUpperCase());
      }

      // MiddleName

      if (user.data.application.sponsormiddle_name) {
        form
          .getTextField("form1[0].#subform[6].Pt5Line4c_MiddleName[0]")
          .setText(user.data.application.sponsormiddle_name?.toUpperCase());
      }

      // AlienNumber

      if (user.data.application.anumbersponsor_name) {
        form
          .getTextField("form1[0].#subform[6].Pt5Line5_AlienNumber[0]")
          .setText(user.data.application.anumbersponsor_name?.toUpperCase());
      }

      if (user.data.application.marriagestate_name) {
        form
          .getTextField("form1[0].#subform[6].Pt5Line9b_State[0]")
          .setText(user.data.application.marriagestate_name);
      }

      // MaritalStatus

      if (user.data.application.name) {
        form
          .getCheckBox("form1[0].#subform[6].Pt5Line1_MaritalStatus[3]")
          .check();
      }

      // const hhhsadddd = user.data.application.insaidedateofbirrth_name;
      // if (Array.isArray(hhhsadddd) && hhhsadddd.length) {
      // 	const hhhsa = new Date(hhhsadddd[0]);
      // 	if (isNaN(hhhsa) || !hhhsa) hhhsa = new Date();
      // 	let date_to_fillfd = (hhhsa.getMonth() < 9 && '0' || '') + (hhhsa.getMonth() + 1) + '/';
      // 	date_to_fillfd += (hhhsa.getDate() < 10 && '0' || '') + hhhsa.getDate() + '/' + hhhsa.getFullYear();
      // 	form.getTextField('form1[0].#subform[6].Pt5Line6_DateofBirth[0]').setText(date_to_fillfd.toLocaleString());
      // }

      // if (user.data.application.insaidedateofbirrth_name) {
      //   form
      //     .getTextField("form1[0].#subform[6].Pt5Line6_DateofBirth[0]")
      //     .setText(
      //       dateFormatter(user.data.application.insaidedateofbirrth_name)
      //     );
      // }

      if (user.data.application.cityinside_name) {
        form
          .getTextField("form1[0].#subform[6].Pt5Line8a_CityTown[0]")
          .setText(user.data.application.cityinside_name?.toUpperCase());
      }

      if (user.data.application.ofinsidesponsorbirth_name) {
        form
          .getTextField("form1[0].#subform[6].Pt5Line8c_Country[0]")
          .setText(
            user.data.application.ofinsidesponsorbirth_name?.toUpperCase()
          );
      }

      if (user.data.application.insideorprovince_name) {
        form
          .getTextField("form1[0].#subform[6].Pt5Line8b_State[0]")
          .setText(
            user.data.application.insideorprovince_name?.toUpperCase()
          );
      }

      if (user.data.application.name) {
        form.getCheckBox("form1[0].#subform[6].Pt5Line10_YN[0]").check();
      }

      // PREVIOUS PHYSICAL ADDRESS 1

      if (Array.isArray(user.data.application.typeofaddress_names)) {
        // PRVIOUS PHYSICAL ADDRESS 2

        if (user.data.application?.typeofaddress_names.length > 0) {
          // Street number and name

          if (user.data.application.typeofaddress_names[0].usplaces_name) {
            form
              .getTextField(
                "form1[0].#subform[4].Pt3Line7_StreetNumberName[0]"
              )
              .setText(
                user.data.application.typeofaddress_names[0].usplaces_name
                  ?.toUpperCase()
                  .slice(0, 25)
              );
          }

          //   Apt./Ste./Flr. Number (if any)

          if (
            user.data.application.typeofaddress_names[0].numberaptste_name ==
            "Flr"
          ) {
            form.getCheckBox("form1[0].#subform[4].Pt3Line7_Unit[0]").check();
          } else {
            form
              .getCheckBox("form1[0].#subform[4].Pt3Line7_Unit[0]")
              .uncheck();
          }

          if (
            user.data.application.typeofaddress_names[0].numberaptste_name ==
            "Apt"
          ) {
            form.getCheckBox("form1[0].#subform[4].Pt3Line7_Unit[1]").check();
          } else {
            form
              .getCheckBox("form1[0].#subform[4].Pt3Line7_Unit[1]")
              .uncheck();
          }

          if (
            user.data.application.typeofaddress_names[0].numberaptste_name ==
            "Ste"
          ) {
            form.getCheckBox("form1[0].#subform[4].Pt3Line7_Unit[2]").check();
          } else {
            form
              .getCheckBox("form1[0].#subform[4].Pt3Line7_Unit[2]")
              .uncheck();
          }

          if (user.data.application.typeofaddress_names[0].stedf_name) {
            form
              .getTextField(
                "form1[0].#subform[4].Pt3Line7_AptSteFlrNumber[0]"
              )
              .setText(
                user.data.application.typeofaddress_names[0].stedf_name
              );
          }

          // City or town

          if (
            user.data.application.typeofaddress_names[0]
              .previousfuturecityq_name
          ) {
            form
              .getTextField("form1[0].#subform[4].Pt3Line7_CityOrTown[0]")
              .setText(
                user.data.application.typeofaddress_names[0].previousfuturecityq_name
                  ?.toUpperCase()
                  .slice(0, 20)
              );
          }

          // Province

          if (
            user.data.application.typeofaddress_names[0].futurfuturestate_name
          ) {
            form
              .getTextField("form1[0].#subform[4].Pt3Line7_Province[0]")
              .setText(
                user.data.application.typeofaddress_names[0].futurfuturestate_name?.toUpperCase()
              );
          }

          // ZIP Code

          if (
            user.data.application.typeofaddress_names[0]
              .previousfuturewzyzip_name
          ) {
            form
              .getTextField("form1[0].#subform[4].Pt3Line7_ZipCode[0]")
              .setText(
                user.data.application.typeofaddress_names[0].previousfuturewzyzip_name?.toUpperCase()
              );
          }

          // Postal code

          if (
            user.data.application.typeofaddress_names[0]
              .futurepreviousfutu_name
          ) {
            form
              .getTextField("form1[0].#subform[4].Pt3Line7_PostalCode[0]")
              .setText(
                user.data.application.typeofaddress_names[0].futurepreviousfutu_name?.toUpperCase()
              );
          }

          // Country

          if (
            user.data.application.typeofaddress_names[0]
              .previousaddress_name === "USA"
          ) {
            form
              .getTextField("form1[0].#subform[4].Pt3Line7_Country[0]")
              .setText("USA"?.toUpperCase());
          }
          if (
            user.data.application.typeofaddress_names[0]
              .previousaddress_name !== "USA"
          ) {
            form
              .getTextField("form1[0].#subform[4].Pt3Line7_Country[0]")
              .setText(
                user.data.application.typeofaddress_names[0]
                  ?.recenstcountryfuture_name
              );
          }

          // State

          if (
            user.data.application.typeofaddress_names[0]
              .prweviousfuturestate_name
          ) {
            form
              .getDropdown("form1[0].#subform[4].Pt3Line7_State[0]")
              .select(
                user.data.application.typeofaddress_names[0].prweviousfuturestate_name?.toUpperCase()
              );
          }

          // Move in date

          // const lllkxxxxl = user.data.application.typeofaddress_names[1].previousmovein_name;
          // if (Array.isArray(lllkxxxxl) && lllkxxxxl.length) {
          // 	const lllkl = new Date(lllkxxxxl[0]);
          // 	if (isNaN(lllkl) || !lllkl) lllkl = new Date();
          // 	let date_to_fillhj = (lllkl.getMonth() < 9 && '0' || '') + (lllkl.getMonth() + 1) + '/';
          // 	date_to_fillhj += (lllkl.getDate() < 10 && '0' || '') + lllkl.getDate() + '/' + lllkl.getFullYear();
          // 	form.getTextField('form1[0].#subform[4].Pt3Line8a_DateFrom[0]').setText(date_to_fillhj.toLocaleString());
          // }

          // const lllkxxxxl = user.data.application.employerone_names[0].currentemployment_name;
          // if (lllkxxxxl?.length) {
          // 	const lllkl = user.data.application.children_names[2].childscurrentdatefobirth_name ?? '';
          // 	console.log(lllkl);
          // 	const [day, month, year] = new Date(lllkl).toLocaleDateString('en-GB').split('/');
          // 	const date = [month, day, year].join('/')
          // 	console.log(date);
          // 	form.getTextField('form1[0].#subform[5].Pt3Line14b_DateTo[0]').setText(date);
          // }

          // if (
          //   user.data.application.typeofaddress_names[0].previousmovein_name
          // ) {
          //   form
          //     .getTextField("form1[0].#subform[4].Pt3Line8a_DateFrom[0]")
          //     .setText(
          //       dateFormatter(
          //         user.data.application.typeofaddress_names[0]
          //           .previousmovein_name
          //       )
          //     );
          // }

          // Move out date

          // const hhhpoaaaaa = user.data.application.typeofaddress_names[1].previousmoveout_name;
          // if (Array.isArray(hhhpoaaaaa) && hhhpoaaaaa.length) {
          // 	const hhhpo = new Date(hhhpoaaaaa[0]);
          // 	if (isNaN(hhhpo) || !hhhpo) hhhpo = new Date();
          // 	let date_to_fillfg = (hhhpo.getMonth() < 9 && '0' || '') + (hhhpo.getMonth() + 1) + '/';
          // 	date_to_fillfg += (hhhpo.getDate() < 10 && '0' || '') + hhhpo.getDate() + '/' + hhhpo.getFullYear();
          // 	form.getTextField('form1[0].#subform[4].Pt3Line8b_DateTo[0]').setText(date_to_fillfg.toLocaleString());
          // }

          // if (
          //   user.data.application.typeofaddress_names[0].previousmoveout_name
          // ) {
          //   form
          //     .getTextField("form1[0].#subform[4].Pt3Line8b_DateTo[0]")
          //     .setText(
          //       dateFormatter(
          //         user.data.application.typeofaddress_names[0]
          //           .previousmoveout_name
          //       )
          //     );
          // }
        }

        if (user.data.application.name) {
          form
            .getTextField("form1[0].#subform[19].Pt14Line3a_PageNumber[0]")
            .setText("5");
        }

        if (user.data.application.middle_name) {
          form
            .getTextField("form1[0].#subform[19].Pt14Line3b_PartNumber[0]")
            .setText("3");
        }

        if (user.data.application.family_name) {
          form
            .getTextField("form1[0].#subform[19].Pt14Line3c_ItemNumber[0]")
            .setText("5");
        }

        if (user.data.application.name) {
          form
            .getTextField("form1[0].#subform[19].Pt14Line4a_PageNumber[0]")
            .setText("5");
        }

        if (user.data.application.middle_name) {
          form
            .getTextField("form1[0].#subform[19].Pt14Line4b_PartNumber[0]")
            .setText("3");
        }

        if (user.data.application.family_name) {
          form
            .getTextField("form1[0].#subform[19].Pt14Line4c_ItemNumber[0]")
            .setText("5");
        }

        // PREVIOUS PHYSICAL ADDRESS 1

        if (user.data.application?.typeofaddress_names.length > 1) {
          // Street number and name

          if (
            user.data.application.typeofaddress_names[1]
              .previousaddress_name === "USA"
          ) {
            form
              .getTextField(
                "form1[0].#subform[4].Pt3Line9_StreetNumberName[0]"
              )
              .setText(
                user.data.application.typeofaddress_names[1].usplaces_name
              );
          }

          // Apt./Ste./Flr. Number (if any)

          if (
            user.data.application.typeofaddress_names[1].numberaptste_name ==
            "Flr"
          ) {
            form.getCheckBox("form1[0].#subform[4].Pt3Line9_Unit[0]").check();
          } else {
            form
              .getCheckBox("form1[0].#subform[4].Pt3Line9_Unit[0]")
              .uncheck();
          }

          if (
            user.data.application.typeofaddress_names[1].numberaptste_name ==
            "Apt"
          ) {
            form.getCheckBox("form1[0].#subform[4].Pt3Line9_Unit[1]").check();
          } else {
            form
              .getCheckBox("form1[0].#subform[4].Pt3Line9_Unit[1]")
              .uncheck();
          }

          if (
            user.data.application.typeofaddress_names[1].numberaptste_name ==
            "Ste"
          ) {
            form.getCheckBox("form1[0].#subform[4].Pt3Line9_Unit[2]").check();
          } else {
            form
              .getCheckBox("form1[0].#subform[4].Pt3Line9_Unit[2]")
              .uncheck();
          }

          if (user.data.application.typeofaddress_names[1].stedf_name) {
            form
              .getTextField(
                "form1[0].#subform[4].Pt3Line9_AptSteFlrNumber[0]"
              )
              .setText(
                user.data.application.typeofaddress_names[1].stedf_name
              );
          }

          // City or town

          if (
            user.data.application.typeofaddress_names[1]
              .previousfuturecityq_name
          ) {
            form
              .getTextField("form1[0].#subform[4].Pt3Line9_CityOrTown[0]")
              .setText(
                user.data.application.typeofaddress_names[1].previousfuturecityq_name?.toUpperCase()
              );
          }

          // Province

          if (
            user.data.application.typeofaddress_names[1].futurfuturestate_name
          ) {
            form
              .getTextField("form1[0].#subform[4].Pt3Line9_Province[0]")
              .setText(
                user.data.application.typeofaddress_names[1].futurfuturestate_name?.toUpperCase()
              );
          }

          // ZIP Code

          if (
            user.data.application.typeofaddress_names[1]
              .previousfuturewzyzip_name
          ) {
            form
              .getTextField("form1[0].#subform[4].Pt3Line9_ZipCode[0]")
              .setText(
                user.data.application.typeofaddress_names[1].previousfuturewzyzip_name?.toUpperCase()
              );
          }

          // Postal code

          if (
            user.data.application.typeofaddress_names[1]
              .futurepreviousfutu_name
          ) {
            form
              .getTextField("form1[0].#subform[4].Pt3Line9_PostalCode[0]")
              .setText(
                user.data.application.typeofaddress_names[1].futurepreviousfutu_name?.toUpperCase()
              );
          }

          // Country
          if (
            user.data.application.typeofaddress_names[1]
              .previousaddress_name === "USA"
          ) {
            form
              .getTextField("form1[0].#subform[4].Pt3Line9_Country[0]")
              .setText("USA"?.toUpperCase());
          }

          if (
            user.data.application.typeofaddress_names[1]
              .previousaddress_name !== "USA"
          ) {
            form
              .getTextField("form1[0].#subform[4].Pt3Line9_Country[0]")
              .setText(
                user.data.application.typeofaddress_names[1]?.recenstcountryfuture_name?.toUpperCase()
              );
          }

          // State

          if (
            user.data.application.typeofaddress_names[1]
              .prweviousfuturestate_name
          ) {
            form
              .getDropdown("form1[0].#subform[4].Pt3Line9_State[0]")
              .select(
                user.data.application.typeofaddress_names[1]
                  .prweviousfuturestate_name
              );
          }

          // Move in date

          // const lllgtggggg = user.data.application.typeofaddress_names[1].previousmovein_name;
          // if (Array.isArray(lllgtggggg) && lllgtggggg.length) {
          // 	const lllgt = new Date(lllgtggggg[0]);
          // 	if (isNaN(lllgt) || !lllgt) lllgt = new Date();
          // 	let date_to_fillcd = (lllgt.getMonth() < 9 && '0' || '') + (lllgt.getMonth() + 1) + '/';
          // 	date_to_fillcd += (lllgt.getDate() < 10 && '0' || '') + lllgt.getDate() + '/' + lllgt.getFullYear();
          // 	form.getTextField('form1[0].#subform[4].Pt3Line10a_DateFrom[0]').setText(date_to_fillcd.toLocaleString());
          // }

          if (
            user.data.application.typeofaddress_names[1].previousmovein_name
          ) {
            form
              .getTextField("form1[0].#subform[4].Pt3Line10a_DateFrom[0]")
              .setText(
                dateFormatter(
                  user.data.application.typeofaddress_names[1]
                    .previousmovein_name
                )
              );
          }

          // Move out date

          // const hhhtghjghj = user.data.application.typeofaddress_names[2].previousmoveout_name;
          // if (Array.isArray(hhhtghjghj) && hhhtghjghj.length) {
          // 	const hhhtg = new Date(hhhtghjghj[0]);
          // 	if (isNaN(hhhtg) || !hhhtg) hhhtg = new Date();
          // 	let date_to_filldc = (hhhtg.getMonth() < 9 && '0' || '') + (hhhtg.getMonth() + 1) + '/';
          // 	date_to_filldc += (hhhtg.getDate() < 10 && '0' || '') + hhhtg.getDate() + '/' + hhhtg.getFullYear();
          // 	form.getTextField('form1[0].#subform[4].Pt3Line10a_DateTo[0]').setText(date_to_filldc.toLocaleString());
          // }

          if (
            user.data.application.typeofaddress_names[1].previousmoveout_name
          ) {
            form
              .getTextField("form1[0].#subform[4].Pt3Line10a_DateTo[0]")
              .setText(
                dateFormatter(
                  user.data.application.typeofaddress_names[1]
                    .previousmoveout_name
                )
              );
          }
        }

        if (user.data.application.typeofaddress_names.length) {
          let srtt = "";

          if (user.data.application.typeofaddress_names[1]?.usplaces_name)
            // res.push(user.data.application.typeofaddress_names[1].usplaces_name)
            srtt += `${user.data.application.typeofaddress_names[1].usplaces_name}, `;

          if (user.data.application.typeofaddress_names[1]?.numberaptste_name)
            // res.push(user.data.application.typeofaddress_names[1].numberaptste_name)
            srtt += `${user.data.application.typeofaddress_names[1].numberaptste_name} `;

          if (user.data.application.typeofaddress_names[1]?.stedf_name)
            // res.push(user.data.application.typeofaddress_names[1].stedf_name)
            srtt += `${user.data.application.typeofaddress_names[1].stedf_name}, `;

          if (
            user.data.application.typeofaddress_names[1]
              ?.previousfuturecityq_name
          )
            // res.push(user.data.application.typeofaddress_names[1].previousfuturecityq_name)
            srtt += `${user.data.application.typeofaddress_names[1].previousfuturecityq_name}, `;

          if (
            user.data.application.typeofaddress_names[1]
              ?.prweviousfuturestate_name
          )
            // res.push(user.data.application.typeofaddress_names[1].prweviousfuturestate_name)
            srtt += `${user.data.application.typeofaddress_names[1].prweviousfuturestate_name}, `;

          if (
            user.data.application.typeofaddress_names[1]
              ?.previousfuturewzyzip_name
          )
            // res.push(user.data.application.typeofaddress_names[1].previousfuturewzyzip_name)
            srtt += `${user.data.application.typeofaddress_names[1].previousfuturewzyzip_name}, `;

          if (
            user.data.application.typeofaddress_names[1]
              ?.futurfuturestate_name
          )
            // res.push(user.data.application.typeofaddress_names[1].futurfuturestate_name)
            srtt += `${user.data.application.typeofaddress_names[1].futurfuturestate_name}, `;

          if (
            user.data.application.typeofaddress_names[1]
              ?.futurepreviousfutu_name
          )
            // res.push(user.data.application.typeofaddress_names[1].futurepreviousfutu_name)
            srtt += `${user.data.application.typeofaddress_names[1].futurepreviousfutu_name}, `;

          if (
            user.data.application.typeofaddress_names[1]
              ?.previousaddress_name === "USA"
          )
            // res.push(user.data.application.typeofaddress_names[1].previousaddress_name)
            srtt += `${user.data.application.typeofaddress_names[1].previousaddress_name}, `;
          else if (
            user.data.application.typeofaddress_names[1]
              ?.previousaddress_name !== "USA" &&
            user.data.application.typeofaddress_names[1]?.previousaddress_name
          )
            // res.push(user.data.application.typeofaddress_names[1]?.countphysical_name)
            srtt += `${user.data.application.typeofaddress_names[1]?.recenstcountryfuture_name}, `;

          if (
            user.data.application.typeofaddress_names[1]?.previousmovein_name
          )
            // res.push(dateFormatter(user.data.application.typeofaddress_names[1].previousmovein_name))
            srtt += `${dateFormatter(
              user.data.application.typeofaddress_names[1].previousmovein_name
            )} TO `;

          if (
            user.data.application.typeofaddress_names[1]?.previousmoveout_name
          )
            // res.push(dateFormatter(user.data.application.typeofaddress_names[1].previousmoveout_name))
            srtt += `${dateFormatter(
              user.data.application.typeofaddress_names[1]
                .previousmoveout_name
            )} \n`;

          if (user.data.application.typeofaddress_names[2]?.usplaces_name)
            // res.push(user.data.application.typeofaddress_names[2].usplaces_name)
            srtt += `${user.data.application.typeofaddress_names[2].usplaces_name}, `;

          if (user.data.application.typeofaddress_names[2]?.numberaptste_name)
            // res.push(user.data.application.typeofaddress_names[2].numberaptste_name)
            srtt += `${user.data.application.typeofaddress_names[2].numberaptste_name} `;

          if (user.data.application.typeofaddress_names[2]?.stedf_name)
            // res.push(user.data.application.typeofaddress_names[2].stedf_name)
            srtt += `${user.data.application.typeofaddress_names[2].stedf_name}, `;

          if (
            user.data.application.typeofaddress_names[2]
              ?.previousfuturecityq_name
          )
            // res.push(user.data.application.typeofaddress_names[2].previousfuturecityq_name)
            srtt += `${user.data.application.typeofaddress_names[2].previousfuturecityq_name}, `;

          if (
            user.data.application.typeofaddress_names[2]
              ?.prweviousfuturestate_name
          )
            // res.push(user.data.application.typeofaddress_names[2].prweviousfuturestate_name)
            srtt += `${user.data.application.typeofaddress_names[2].prweviousfuturestate_name}, `;

          if (
            user.data.application.typeofaddress_names[2]
              ?.previousfuturewzyzip_name
          )
            // res.push(user.data.application.typeofaddress_names[2].previousfuturewzyzip_name)
            srtt += `${user.data.application.typeofaddress_names[2].previousfuturewzyzip_name}, `;

          if (
            user.data.application.typeofaddress_names[2]
              ?.futurfuturestate_name
          )
            // res.push(user.data.application.typeofaddress_names[2].futurfuturestate_name)
            srtt += `${user.data.application.typeofaddress_names[2].futurfuturestate_name}, `;

          if (
            user.data.application.typeofaddress_names[2]
              ?.futurepreviousfutu_name
          )
            // res.push(user.data.application.typeofaddress_names[2].futurepreviousfutu_name)
            srtt += `${user.data.application.typeofaddress_names[2].futurepreviousfutu_name}, `;

          if (
            user.data.application.typeofaddress_names[2]
              ?.previousaddress_name === "USA"
          )
            // res.push(user.data.application.typeofaddress_names[2].previousaddress_name)
            srtt += `${user.data.application.typeofaddress_names[2].previousaddress_name}, `;
          else if (
            user.data.application.typeofaddress_names[2]
              ?.previousaddress_name !== "USA" &&
            user.data.application.typeofaddress_names[2]?.previousaddress_name
          )
            // res.push(user.data.application.typeofaddress_names[2]?.countphysical_name)
            srtt += `${user.data.application.typeofaddress_names[2]?.recenstcountryfuture_name}, `;

          if (
            user.data.application.typeofaddress_names[2]?.previousmovein_name
          )
            // res.push(dateFormatter(user.data.application.typeofaddress_names[2].previousmovein_name))
            srtt += `${dateFormatter(
              user.data.application.typeofaddress_names[2].previousmovein_name
            )} TO `;

          if (
            user.data.application.typeofaddress_names[2]?.previousmoveout_name
          )
            //   // res.push(dateFormatter(user.data.application.typeofaddress_names[2].previousmoveout_name))
            srtt += `${dateFormatter(
              user.data.application.typeofaddress_names[2]
                .previousmoveout_name
            )} \n`;

          form
            .getTextField(
              "form1[0].#subform[19].Pt14Line3d_AdditionalInfo[0]"
            )
            .setText(srtt?.toUpperCase());
        }

        if (user.data.application.typeofaddress_names.length) {
          let srtt = "";

          if (user.data.application.typeofaddress_names[3]?.usplaces_name)
            // res.push(user.data.application.typeofaddress_names[1].usplaces_name)
            srtt += `${user.data.application.typeofaddress_names[3].usplaces_name}, `;

          if (user.data.application.typeofaddress_names[3]?.numberaptste_name)
            // res.push(user.data.application.typeofaddress_names[3].numberaptste_name)
            srtt += `${user.data.application.typeofaddress_names[3].numberaptste_name} `;

          if (user.data.application.typeofaddress_names[3]?.stedf_name)
            // res.push(user.data.application.typeofaddress_names[3].stedf_name)
            srtt += `${user.data.application.typeofaddress_names[3].stedf_name}, `;

          if (
            user.data.application.typeofaddress_names[3]
              ?.previousfuturecityq_name
          )
            // res.push(user.data.application.typeofaddress_names[3].previousfuturecityq_name)
            srtt += `${user.data.application.typeofaddress_names[3].previousfuturecityq_name}, `;

          if (
            user.data.application.typeofaddress_names[3]
              ?.prweviousfuturestate_name
          )
            // res.push(user.data.application.typeofaddress_names[3].prweviousfuturestate_name)
            srtt += `${user.data.application.typeofaddress_names[3].prweviousfuturestate_name}, `;

          if (
            user.data.application.typeofaddress_names[3]
              ?.previousfuturewzyzip_name
          )
            // res.push(user.data.application.typeofaddress_names[3].previousfuturewzyzip_name)
            srtt += `${user.data.application.typeofaddress_names[3].previousfuturewzyzip_name}, `;

          if (
            user.data.application.typeofaddress_names[3]
              ?.futurfuturestate_name
          )
            // res.push(user.data.application.typeofaddress_names[3].futurfuturestate_name)
            srtt += `${user.data.application.typeofaddress_names[3].futurfuturestate_name}, `;

          if (
            user.data.application.typeofaddress_names[3]
              ?.futurepreviousfutu_name
          )
            // res.push(user.data.application.typeofaddress_names[3].futurepreviousfutu_name)
            srtt += `${user.data.application.typeofaddress_names[3].futurepreviousfutu_name}, `;

          if (
            user.data.application.typeofaddress_names[3]
              ?.previousaddress_name === "USA"
          )
            // res.push(user.data.application.typeofaddress_names[3].previousaddress_name)
            srtt += `${user.data.application.typeofaddress_names[3].previousaddress_name}, `;
          else if (
            user.data.application.typeofaddress_names[3]
              ?.previousaddress_name !== "USA" &&
            user.data.application.typeofaddress_names[3]?.previousaddress_name
          )
            // res.push(user.data.application.typeofaddress_names[3]?.countphysical_name)
            srtt += `${user.data.application.typeofaddress_names[3]?.recenstcountryfuture_name}, `;

          if (
            user.data.application.typeofaddress_names[3]?.previousmovein_name
          )
            // res.push(dateFormatter(user.data.application.typeofaddress_names[3].previousmovein_name))
            srtt += `${dateFormatter(
              user.data.application.typeofaddress_names[3].previousmovein_name
            )} TO `;

          if (
            user.data.application.typeofaddress_names[3]?.previousmoveout_name
          )
            // res.push(dateFormatter(user.data.application.typeofaddress_names[3].previousmoveout_name))
            srtt += `${dateFormatter(
              user.data.application.typeofaddress_names[3]
                .previousmoveout_name
            )} \n`;

          if (user.data.application.typeofaddress_names[4]?.usplaces_name)
            // res.push(user.data.application.typeofaddress_names[4].usplaces_name)
            srtt += `${user.data.application.typeofaddress_names[4].usplaces_name}, `;

          if (user.data.application.typeofaddress_names[4]?.numberaptste_name)
            // res.push(user.data.application.typeofaddress_names[4].numberaptste_name)
            srtt += `${user.data.application.typeofaddress_names[4].numberaptste_name} `;

          if (user.data.application.typeofaddress_names[4]?.stedf_name)
            // res.push(user.data.application.typeofaddress_names[4].stedf_name)
            srtt += `${user.data.application.typeofaddress_names[4].stedf_name}, `;

          if (
            user.data.application.typeofaddress_names[4]
              ?.previousfuturecityq_name
          )
            // res.push(user.data.application.typeofaddress_names[4].previousfuturecityq_name)
            srtt += `${user.data.application.typeofaddress_names[4].previousfuturecityq_name}, `;

          if (
            user.data.application.typeofaddress_names[4]
              ?.prweviousfuturestate_name
          )
            // res.push(user.data.application.typeofaddress_names[4].prweviousfuturestate_name)
            srtt += `${user.data.application.typeofaddress_names[4].prweviousfuturestate_name}, `;

          if (
            user.data.application.typeofaddress_names[4]
              ?.previousfuturewzyzip_name
          )
            // res.push(user.data.application.typeofaddress_names[4].previousfuturewzyzip_name)
            srtt += `${user.data.application.typeofaddress_names[4].previousfuturewzyzip_name}, `;

          if (
            user.data.application.typeofaddress_names[4]
              ?.futurfuturestate_name
          )
            // res.push(user.data.application.typeofaddress_names[4].futurfuturestate_name)
            srtt += `${user.data.application.typeofaddress_names[4].futurfuturestate_name}, `;

          if (
            user.data.application.typeofaddress_names[4]
              ?.futurepreviousfutu_name
          )
            // res.push(user.data.application.typeofaddress_names[4].futurepreviousfutu_name)
            srtt += `${user.data.application.typeofaddress_names[4].futurepreviousfutu_name}, `;

          if (
            user.data.application.typeofaddress_names[4]
              ?.previousaddress_name === "USA"
          )
            // res.push(user.data.application.typeofaddress_names[4].previousaddress_name)
            srtt += `${user.data.application.typeofaddress_names[4].previousaddress_name}, `;
          else if (
            user.data.application.typeofaddress_names[4]
              ?.previousaddress_name !== "USA" &&
            user.data.application.typeofaddress_names[4]?.previousaddress_name
          )
            // res.push(user.data.application.typeofaddress_names[4]?.countphysical_name)
            srtt += `${user.data.application.typeofaddress_names[4]?.recenstcountryfuture_name}, `;

          if (
            user.data.application.typeofaddress_names[4]?.previousmovein_name
          )
            // res.push(dateFormatter(user.data.application.typeofaddress_names[4].previousmovein_name))
            srtt += `${dateFormatter(
              user.data.application.typeofaddress_names[4].previousmovein_name
            )} TO `;

          if (
            user.data.application.typeofaddress_names[4]?.previousmoveout_name
          )
            //   // res.push(dateFormatter(user.data.application.typeofaddress_names[4].previousmoveout_name))
            srtt += `${dateFormatter(
              user.data.application.typeofaddress_names[4]
                .previousmoveout_name
            )} \n`;

          form
            .getTextField(
              "form1[0].#subform[19].Pt14Line4d_AdditionalInfo[0]"
            )
            .setText(srtt?.toUpperCase());
        }

        if (user.data.application.usportofentry_name == "yes") {
          form.getCheckBox("form1[0].#subform[2].Pt1Line25a_CB[0]").check();
        } else {
          form.getCheckBox("form1[0].#subform[2].Pt1Line25a_CB[0]").uncheck();
        }

        if (user.data.application.arrivedintheus_name) {
          form
            .getTextField("form1[0].#subform[2].Pt1Line25a_AdmissionEntry[0]")
            .setText(user.data.application.arrivedintheus_name);
        }

        if (user.data.application.usarrivedinthe_name == "no") {
          form.getCheckBox("form1[0].#subform[2].Pt1Line25b_CB[0]").check();
        } else {
          form.getCheckBox("form1[0].#subform[2].Pt1Line25b_CB[0]").uncheck();
        }

        if (user.data.application.wasparoled_name) {
          form
            .getTextField("form1[0].#subform[2].Pt1Line25b_ParoleEntrance[0]")
            .setText(user.data.application.wasparoled_name);
        }

        if (user.data.application.formrecordnumber_name) {
          form
            .getTextField("form1[0].#subform[2].P2Line26a_I94[0]")
            .setText(user.data.application.formrecordnumber_name);
        }

        // if (user.data.application.form94_name) {
        //   form.getTextField('form1[0].#subform[2].P2Line26a_I94[0]').setText(user.data.application.form94_name);
        // }

        if (user.data.application.form94_name) {
          form
            .getTextField("form1[0].#subform[2].Pt1Line26b_Date[0]")
            .setText(dateFormatter(user.data.application.form94_name));
        }

        if (user.data.application.form94middleform_name) {
          form
            .getTextField("form1[0].#subform[2].Pt1Line26c_Status[0]")
            .setText(user.data.application.form94middleform_name);
        }

        // if (user.data.application.usarrivedinthe_name == 'three') {
        //   form.getCheckBox('form1[0].#subform[2].Pt1Line25b_CB[0]').check();
        // } else {
        //   form.getCheckBox('form1[0].#subform[2].Pt1Line25b_CB[0]').uncheck();
        // }

        // if (user.data.application.wasparoled_name) {
        //   form.getTextField('form1[0].#subform[2].Pt1Line25a_AdmissionEntry[0]').setText(user.data.application.wasparoled_name);
        // }

        if (user.data.application.name) {
          form
            .getTextField("form1[0].#subform[19].Pt14Line5a_PageNumber[0]")
            .setText("5");
        }

        if (user.data.application.name) {
          form
            .getTextField("form1[0].#subform[19].Pt14Line5b_PartNumber[0]")
            .setText("3");
        }

        if (user.data.application.name) {
          form
            .getTextField("form1[0].#subform[19].Pt14Line5c_ItemNumber[0]")
            .setText("11");
        }

        if (user.data.application.name) {
          form
            .getTextField("form1[0].#subform[19].Pt14Line6a_PageNumber[0]")
            .setText("5");
        }

        if (user.data.application.name) {
          form
            .getTextField("form1[0].#subform[19].Pt14Line6b_PartNumber[0]")
            .setText("3");
        }

        if (user.data.application.name) {
          form
            .getTextField("form1[0].#subform[19].Pt14Line6c_ItemNumber[0]")
            .setText("11");
        }

        if (user.data.application.name) {
          form
            .getTextField("form1[0].#subform[19].Pt14Line7a_PageNumber[0]")
            .setText("8");
        }

        if (user.data.application.name) {
          form
            .getTextField("form1[0].#subform[19].Pt14Line7b_PartNumber[0]")
            .setText("5");
        }

        if (user.data.application.name) {
          form
            .getTextField("form1[0].#subform[19].Pt14Line7c_ItemNumber[0]")
            .setText("11");
        }

        if (user.data.application.marriages_names.length) {
          let uipi = "";

          if (user.data.application.marriages_names[1]?.mother_name)
            // res.push(user.data.application.marriages_names[1].mother_name)
            uipi += `${user.data.application.marriages_names[1].mother_name}, `;

          if (user.data.application.marriages_names[1]?.mothermiddle_name)
            // res.push(user.data.application.marriages_names[1].mothermiddle_name)
            uipi += `${user.data.application.marriages_names[1].mothermiddle_name} `;

          if (user.data.application.marriages_names[1]?.motherfamily_name)
            // res.push(user.data.application.marriages_names[1].motherfamily_name)
            uipi += `${user.data.application.marriages_names[1].motherfamily_name}, `;

          if (
            user.data.application.marriages_names[1]?.marriagedatespouses_name
          )
            // res.push(dateFormatter(user.data.application.marriages_names[1].marriagedatespouses_name))
            uipi += `${dateFormatter(
              user.data.application.marriages_names[1]
                .marriagedatespouses_name
            )}, `;

          if (
            user.data.application.marriages_names[1]?.marriagedatespouse_name
          )
            // res.push(dateFormatter(user.data.application.marriages_names[1].marriagedatespouse_name))
            uipi += `${dateFormatter(
              user.data.application.marriages_names[1].marriagedatespouse_name
            )}, `;

          if (
            user.data.application.marriages_names[1]
              ?.marriagetopriortownspouse_name
          )
            // res.push(user.data.application.marriages_names[1].marriagetopriortownspouse_name)
            uipi += `${user.data.application.marriages_names[1].marriagetopriortownspouse_name}, `;

          if (
            user.data.application.marriages_names[1]
              ?.marriagetopriorprovince_name
          )
            // res.push(user.data.application.marriages_names[1].marriagetopriorprovince_name)
            uipi += `${user.data.application.marriages_names[1].marriagetopriorprovince_name}, `;

          if (
            user.data.application.marriages_names[1]
              ?.marriagetopriorcountry_name
          )
            // res.push(user.data.application.marriages_names[1].marriagetopriorcountry_name)
            uipi += `${user.data.application.marriages_names[1].marriagetopriorcountry_name}, `;

          if (
            user.data.application.marriages_names[1]
              ?.marriagespousesdateofbirth_name
          )
            // res.push(dateFormatter(user.data.application.marriages_names[1].marriagespousesdateofbirth_name))
            uipi += `${dateFormatter(
              user.data.application.marriages_names[1]
                .marriagespousesdateofbirth_name
            )}, `;

          if (
            user.data.application.marriages_names[1]
              ?.marriagelegallyendedtown_name
          )
            // res.push(user.data.application.marriages_names[1].marriagelegallyendedtown_name)
            uipi += `${user.data.application.marriages_names[1].marriagelegallyendedtown_name}, `;

          if (
            user.data.application.marriages_names[1]
              ?.marriagelegallyendedstate_name
          )
            // res.push(user.data.application.marriages_names[1].marriagelegallyendedstate_name)
            uipi += `${user.data.application.marriages_names[1].marriagelegallyendedstate_name}, `;

          if (
            user.data.application.marriages_names[1]
              ?.marriagelegallyendedcontry_name
          )
            // res.push(user.data.application.marriages_names[1].marriagelegallyendedcontry_name)
            uipi += `${user.data.application.marriages_names[1].marriagelegallyendedcontry_name}, \n`;

          if (user.data.application.marriages_names[2]?.mother_name)
            // res.push(user.data.application.marriages_names[1].mother_name)
            uipi += `${user.data.application.marriages_names[2].mother_name}, `;

          if (user.data.application.marriages_names[2]?.mothermiddle_name)
            // res.push(user.data.application.marriages_names[2].mothermiddle_name)
            uipi += `${user.data.application.marriages_names[2].mothermiddle_name} `;

          if (user.data.application.marriages_names[2]?.motherfamily_name)
            // res.push(user.data.application.marriages_names[2].motherfamily_name)
            uipi += `${user.data.application.marriages_names[2].motherfamily_name}, `;

          if (
            user.data.application.marriages_names[2]?.marriagedatespouses_name
          )
            // res.push(dateFormatter(user.data.application.marriages_names[2].marriagedatespouses_name))
            uipi += `${dateFormatter(
              user.data.application.marriages_names[2]
                .marriagedatespouses_name
            )}, `;

          if (
            user.data.application.marriages_names[2]?.marriagedatespouse_name
          )
            // res.push(dateFormatter(user.data.application.marriages_names[2].marriagedatespouse_name))
            uipi += `${dateFormatter(
              user.data.application.marriages_names[2].marriagedatespouse_name
            )}, `;

          if (
            user.data.application.marriages_names[2]
              ?.marriagetopriortownspouse_name
          )
            // res.push(user.data.application.marriages_names[2].marriagetopriortownspouse_name)
            uipi += `${user.data.application.marriages_names[2].marriagetopriortownspouse_name}, `;

          if (
            user.data.application.marriages_names[2]
              ?.marriagetopriorprovince_name
          )
            // res.push(user.data.application.marriages_names[2].marriagetopriorprovince_name)
            uipi += `${user.data.application.marriages_names[2].marriagetopriorprovince_name}, `;

          if (
            user.data.application.marriages_names[2]
              ?.marriagetopriorcountry_name
          )
            // res.push(user.data.application.marriages_names[2].marriagetopriorcountry_name)
            uipi += `${user.data.application.marriages_names[2].marriagetopriorcountry_name}, `;

          if (
            user.data.application.marriages_names[2]
              ?.marriagespousesdateofbirth_name
          )
            // res.push(dateFormatter(user.data.application.marriages_names[2].marriagespousesdateofbirth_name))
            uipi += `${dateFormatter(
              user.data.application.marriages_names[2]
                .marriagespousesdateofbirth_name
            )}, `;

          if (
            user.data.application.marriages_names[2]
              ?.marriagelegallyendedtown_name
          )
            // res.push(user.data.application.marriages_names[2].marriagelegallyendedtown_name)
            uipi += `${user.data.application.marriages_names[2].marriagelegallyendedtown_name}, `;

          if (
            user.data.application.marriages_names[2]
              ?.marriagelegallyendedstate_name
          )
            // res.push(user.data.application.marriages_names[2].marriagelegallyendedstate_name)
            uipi += `${user.data.application.marriages_names[2].marriagelegallyendedstate_name}, `;

          if (
            user.data.application.marriages_names[2]
              ?.marriagelegallyendedcontry_name
          )
            // res.push(user.data.application.marriages_names[2].marriagelegallyendedcontry_name)
            uipi += `${user.data.application.marriages_names[2].marriagelegallyendedcontry_name}, `;

          form
            .getTextField(
              "form1[0].#subform[19].Pt14Line7d_AdditionalInfo[0]"
            )
            .setText(uipi?.toUpperCase());
        }

        if (user.data.application.employerone_names.length) {
          let srtt = "";

          if (user.data.application.employerone_names[2]?.employer_name)
            // res.push(user.data.application.employerone_names[1].employer_name)
            srtt += `${user.data.application.employerone_names[2].employer_name}, `;

          if (
            user.data.application.employerone_names[2]?.empmailingnumber_name
          )
            // res.push(user.data.application.employerone_names[2].empmailingnumber_name)
            srtt += `${user.data.application.employerone_names[2].empmailingnumber_name} `;

          if (user.data.application.employerone_names[2]?.asfnumberus_name)
            // res.push(user.data.application.employerone_names[2].asfnumberus_name)
            srtt += `${user.data.application.employerone_names[2].asfnumberus_name}, `;

          if (user.data.application.employerone_names[2]?.ssste_name)
            // res.push(user.data.application.employerone_names[2].ssste_name)
            srtt += `${user.data.application.employerone_names[2].ssste_name}, `;

          if (
            user.data.application.employerone_names[2]
              ?.previousfuturecityemployment_name
          )
            // res.push(user.data.application.employerone_names[2].previousfuturecityemployment_name)
            srtt += `${user.data.application.employerone_names[2].previousfuturecityemployment_name}, `;

          if (
            user.data.application.employerone_names[2]
              ?.previousfuturestateemployment_name
          )
            // res.push(user.data.application.employerone_names[2].previousfuturestateemployment_name)
            srtt += `${user.data.application.employerone_names[2].previousfuturestateemployment_name}, `;

          if (user.data.application.employerone_names[2]?.occupationus_name)
            // res.push(user.data.application.employerone_names[2].occupationus_name)
            srtt += `${user.data.application.employerone_names[2].occupationus_name}, `;

          if (user.data.application.employerone_names[2]?.employmentzip_name)
            // res.push(user.data.application.employerone_names[2].employmentzip_name)
            srtt += `${user.data.application.employerone_names[2].employmentzip_name}, `;

          if (user.data.application.employerone_names[2]?.employmentzip_name)
            // res.push(user.data.application.employerone_names[2].employmentzip_name)
            srtt += `${user.data.application.employerone_names[2].employmentzip_name}, `;

          if (
            user.data.application.employerone_names[2]?.employmentpostal_name
          )
            // res.push(user.data.application.employerone_names[2].employmentpostal_name)
            srtt += `${user.data.application.employerone_names[2].employmentpostal_name}, `;

          if (
            user.data.application.employerone_names[2]?.employmentpostal_name
          )
            // res.push(user.data.application.employerone_names[2].employmentpostal_name)
            srtt += `${user.data.application.employerone_names[2].employmentpostal_name}, `;

          if (user.data.application.employerone_names[2]?.occupationus_name)
            // res.push(user.data.application.employerone_names[2].occupationus_name)
            srtt += `${user.data.application.employerone_names[2].occupationus_name}, `;

          if (
            user.data.application.employerone_names[2]
              ?.addressemployment_name === "USA"
          )
            // res.push(user.data.application.employerone_names[2].addressemployment_name)
            srtt += `${user.data.application.employerone_names[2].addressemployment_name}, `;
          else if (
            user.data.application.employerone_names[2]
              ?.addressemployment_name !== "USA" &&
            user.data.application.employerone_names[2]?.addressemployment_name
          )
            // res.push(user.data.application.employerone_names[2]?.countphysical_name)
            srtt += `${user.data.application.employerone_names[2]?.countryemployment_name}, `;

          if (user.data.application.employerone_names[2]?.employment_name)
            // res.push(dateFormatter(user.data.application.employerone_names[2].employment_name))
            srtt += `${dateFormatter(
              user.data.application.employerone_names[2].employment_name
            )} TO `;

          if (
            user.data.application.employerone_names[2]?.currentemployment_name
          )
            // res.push(dateFormatter(user.data.application.employerone_names[2].currentemployment_name))
            srtt += `${dateFormatter(
              user.data.application.employerone_names[2]
                .currentemployment_name
            )} \n`;

          if (user.data.application.employerone_names[3]?.employer_name)
            // res.push(user.data.application.employerone_names[1].employer_name)
            srtt += `${user.data.application.employerone_names[3].employer_name}, `;

          if (
            user.data.application.employerone_names[3]?.empmailingnumber_name
          )
            // res.push(user.data.application.employerone_names[3].empmailingnumber_name)
            srtt += `${user.data.application.employerone_names[3].empmailingnumber_name} `;

          if (user.data.application.employerone_names[3]?.asfnumberus_name)
            // res.push(user.data.application.employerone_names[3].asfnumberus_name)
            srtt += `${user.data.application.employerone_names[3].asfnumberus_name}, `;

          if (user.data.application.employerone_names[3]?.ssste_name)
            // res.push(user.data.application.employerone_names[3].ssste_name)
            srtt += `${user.data.application.employerone_names[3].ssste_name}, `;

          if (
            user.data.application.employerone_names[3]
              ?.previousfuturecityemployment_name
          )
            // res.push(user.data.application.employerone_names[3].previousfuturecityemployment_name)
            srtt += `${user.data.application.employerone_names[3].previousfuturecityemployment_name}, `;

          if (
            user.data.application.employerone_names[3]
              ?.previousfuturestateemployment_name
          )
            // res.push(user.data.application.employerone_names[3].previousfuturestateemployment_name)
            srtt += `${user.data.application.employerone_names[3].previousfuturestateemployment_name}, `;

          if (user.data.application.employerone_names[3]?.occupationus_name)
            // res.push(user.data.application.employerone_names[3].occupationus_name)
            srtt += `${user.data.application.employerone_names[3].occupationus_name}, `;

          if (user.data.application.employerone_names[3]?.employmentzip_name)
            // res.push(user.data.application.employerone_names[3].employmentzip_name)
            srtt += `${user.data.application.employerone_names[3].employmentzip_name}, `;

          if (user.data.application.employerone_names[3]?.employmentzip_name)
            // res.push(user.data.application.employerone_names[3].employmentzip_name)
            srtt += `${user.data.application.employerone_names[3].employmentzip_name}, `;

          if (
            user.data.application.employerone_names[3]?.employmentpostal_name
          )
            // res.push(user.data.application.employerone_names[3].employmentpostal_name)
            srtt += `${user.data.application.employerone_names[3].employmentpostal_name}, `;

          if (
            user.data.application.employerone_names[3]?.employmentpostal_name
          )
            // res.push(user.data.application.employerone_names[3].employmentpostal_name)
            srtt += `${user.data.application.employerone_names[3].employmentpostal_name}, `;

          if (user.data.application.employerone_names[3]?.occupationus_name)
            // res.push(user.data.application.employerone_names[3].occupationus_name)
            srtt += `${user.data.application.employerone_names[3].occupationus_name}, `;

          if (
            user.data.application.employerone_names[3]
              ?.addressemployment_name === "USA"
          )
            // res.push(user.data.application.employerone_names[3].addressemployment_name)
            srtt += `${user.data.application.employerone_names[3].addressemployment_name}, `;
          else if (
            user.data.application.employerone_names[3]
              ?.addressemployment_name !== "USA" &&
            user.data.application.employerone_names[3]?.addressemployment_name
          )
            // res.push(user.data.application.employerone_names[3]?.countphysical_name)
            srtt += `${user.data.application.employerone_names[3]?.countryemployment_name}, `;

          if (user.data.application.employerone_names[3]?.employment_name)
            // res.push(dateFormatter(user.data.application.employerone_names[3].employment_name))
            srtt += `${dateFormatter(
              user.data.application.employerone_names[3].employment_name
            )} TO `;

          if (
            user.data.application.employerone_names[3]?.currentemployment_name
          )
            //   // res.push(dateFormatter(user.data.application.employerone_names[3].currentemployment_name))
            srtt += `${dateFormatter(
              user.data.application.employerone_names[3]
                .currentemployment_name
            )} \n`;

          form
            .getTextField(
              "form1[0].#subform[19].Pt14Line5d_AdditionalInfo[0]"
            )
            .setText(srtt?.toUpperCase());
        }

        if (user.data.application.employerone_names.length) {
          let srtt = "";

          if (user.data.application.employerone_names[4]?.employer_name)
            // res.push(user.data.application.employerone_names[1].employer_name)
            srtt += `${user.data.application.employerone_names[4].employer_name}, `;

          if (
            user.data.application.employerone_names[4]?.empmailingnumber_name
          )
            // res.push(user.data.application.employerone_names[4].empmailingnumber_name)
            srtt += `${user.data.application.employerone_names[4].empmailingnumber_name} `;

          if (user.data.application.employerone_names[4]?.asfnumberus_name)
            // res.push(user.data.application.employerone_names[4].asfnumberus_name)
            srtt += `${user.data.application.employerone_names[4].asfnumberus_name}, `;

          if (user.data.application.employerone_names[4]?.ssste_name)
            // res.push(user.data.application.employerone_names[4].ssste_name)
            srtt += `${user.data.application.employerone_names[4].ssste_name}, `;

          if (
            user.data.application.employerone_names[4]
              ?.previousfuturecityemployment_name
          )
            // res.push(user.data.application.employerone_names[4].previousfuturecityemployment_name)
            srtt += `${user.data.application.employerone_names[4].previousfuturecityemployment_name}, `;

          if (
            user.data.application.employerone_names[4]
              ?.previousfuturestateemployment_name
          )
            // res.push(user.data.application.employerone_names[4].previousfuturestateemployment_name)
            srtt += `${user.data.application.employerone_names[4].previousfuturestateemployment_name}, `;

          if (user.data.application.employerone_names[3]?.occupationus_name)
            // res.push(user.data.application.employerone_names[3].occupationus_name)
            srtt += `${user.data.application.employerone_names[3].occupationus_name}, `;

          if (user.data.application.employerone_names[4]?.employmentzip_name)
            // res.push(user.data.application.employerone_names[4].employmentzip_name)
            srtt += `${user.data.application.employerone_names[4].employmentzip_name}, `;

          if (user.data.application.employerone_names[4]?.employmentzip_name)
            // res.push(user.data.application.employerone_names[4].employmentzip_name)
            srtt += `${user.data.application.employerone_names[4].employmentzip_name}, `;

          if (
            user.data.application.employerone_names[4]?.employmentpostal_name
          )
            // res.push(user.data.application.employerone_names[4].employmentpostal_name)
            srtt += `${user.data.application.employerone_names[4].employmentpostal_name}, `;

          if (
            user.data.application.employerone_names[4]?.employmentpostal_name
          )
            // res.push(user.data.application.employerone_names[4].employmentpostal_name)
            srtt += `${user.data.application.employerone_names[4].employmentpostal_name}, `;

          if (user.data.application.employerone_names[4]?.occupationus_name)
            // res.push(user.data.application.employerone_names[4].occupationus_name)
            srtt += `${user.data.application.employerone_names[4].occupationus_name}, `;

          if (
            user.data.application.employerone_names[4]
              ?.addressemployment_name === "USA"
          )
            // res.push(user.data.application.employerone_names[4].addressemployment_name)
            srtt += `${user.data.application.employerone_names[4].addressemployment_name}, `;
          else if (
            user.data.application.employerone_names[4]
              ?.addressemployment_name !== "USA" &&
            user.data.application.employerone_names[4]?.addressemployment_name
          )
            // res.push(user.data.application.employerone_names[4]?.countphysical_name)
            srtt += `${user.data.application.employerone_names[4]?.countryemployment_name}, `;

          if (user.data.application.employerone_names[4]?.employment_name)
            // res.push(dateFormatter(user.data.application.employerone_names[4].employment_name))
            srtt += `${dateFormatter(
              user.data.application.employerone_names[4].employment_name
            )} TO `;

          if (
            user.data.application.employerone_names[4]?.currentemployment_name
          )
            // res.push(dateFormatter(user.data.application.employerone_names[4].currentemployment_name))
            srtt += `${dateFormatter(
              user.data.application.employerone_names[4]
                .currentemployment_name
            )} \n`;

          if (user.data.application.employerone_names[5]?.employer_name)
            // res.push(user.data.application.employerone_names[1].employer_name)
            srtt += `${user.data.application.employerone_names[5].employer_name}, `;

          if (
            user.data.application.employerone_names[5]?.empmailingnumber_name
          )
            // res.push(user.data.application.employerone_names[5].empmailingnumber_name)
            srtt += `${user.data.application.employerone_names[5].empmailingnumber_name} `;

          if (user.data.application.employerone_names[5]?.asfnumberus_name)
            // res.push(user.data.application.employerone_names[5].asfnumberus_name)
            srtt += `${user.data.application.employerone_names[5].asfnumberus_name}, `;

          if (user.data.application.employerone_names[5]?.ssste_name)
            // res.push(user.data.application.employerone_names[5].ssste_name)
            srtt += `${user.data.application.employerone_names[5].ssste_name}, `;

          if (
            user.data.application.employerone_names[5]
              ?.previousfuturecityemployment_name
          )
            // res.push(user.data.application.employerone_names[5].previousfuturecityemployment_name)
            srtt += `${user.data.application.employerone_names[5].previousfuturecityemployment_name}, `;

          if (
            user.data.application.employerone_names[5]
              ?.previousfuturestateemployment_name
          )
            // res.push(user.data.application.employerone_names[5].previousfuturestateemployment_name)
            srtt += `${user.data.application.employerone_names[5].previousfuturestateemployment_name}, `;

          if (user.data.application.employerone_names[5]?.occupationus_name)
            // res.push(user.data.application.employerone_names[5].occupationus_name)
            srtt += `${user.data.application.employerone_names[5].occupationus_name}, `;

          if (user.data.application.employerone_names[5]?.employmentzip_name)
            // res.push(user.data.application.employerone_names[5].employmentzip_name)
            srtt += `${user.data.application.employerone_names[5].employmentzip_name}, `;

          if (user.data.application.employerone_names[5]?.employmentzip_name)
            // res.push(user.data.application.employerone_names[5].employmentzip_name)
            srtt += `${user.data.application.employerone_names[5].employmentzip_name}, `;

          if (
            user.data.application.employerone_names[5]?.employmentpostal_name
          )
            // res.push(user.data.application.employerone_names[5].employmentpostal_name)
            srtt += `${user.data.application.employerone_names[5].employmentpostal_name}, `;

          if (
            user.data.application.employerone_names[5]?.employmentpostal_name
          )
            // res.push(user.data.application.employerone_names[5].employmentpostal_name)
            srtt += `${user.data.application.employerone_names[5].employmentpostal_name}, `;

          if (user.data.application.employerone_names[5]?.occupationus_name)
            // res.push(user.data.application.employerone_names[5].occupationus_name)
            srtt += `${user.data.application.employerone_names[5].occupationus_name}, `;

          if (
            user.data.application.employerone_names[5]
              ?.addressemployment_name === "USA"
          )
            // res.push(user.data.application.employerone_names[5].addressemployment_name)
            srtt += `${user.data.application.employerone_names[5].addressemployment_name}, `;
          else if (
            user.data.application.employerone_names[5]
              ?.addressemployment_name !== "USA" &&
            user.data.application.employerone_names[5]?.addressemployment_name
          )
            // res.push(user.data.application.employerone_names[5]?.countphysical_name)
            srtt += `${user.data.application.employerone_names[5]?.countryemployment_name}, `;

          if (user.data.application.employerone_names[5]?.employment_name)
            // res.push(dateFormatter(user.data.application.employerone_names[5].employment_name))
            srtt += `${dateFormatter(
              user.data.application.employerone_names[5].employment_name
            )} TO `;

          if (
            user.data.application.employerone_names[5]?.currentemployment_name
          )
            //   // res.push(dateFormatter(user.data.application.employerone_names[5].currentemployment_name))
            srtt += `${dateFormatter(
              user.data.application.employerone_names[5]
                .currentemployment_name
            )} \n`;

          form
            .getTextField(
              "form1[0].#subform[19].Pt14Line6d_AdditionalInfo[0]"
            )
            .setText(srtt?.toUpperCase());
        }
      }
      let src = `${__dirname}/pdf_forms/i-485_done.pdf`;
      const pdfBytes = await pdfDoc.save();
      fs.writeFileSync(src, Buffer.from(pdfBytes));
      res.sendFile(src);
    }
  });
    
}

const pdfDownload765 = async (req, res) => {

  const existingPdfBytes = fs.readFileSync(`${__dirname}/pdf_forms/i-765.pdf`);
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const form = pdfDoc.getForm();
  //temp
  const fields = form.getFields();
  fields.forEach((field) => {
    const name = field.getName();
    console.log(`${name} `);
  });
  //temp
  Data.findOne({
    _id: req.params.user_id,
  }).exec(async function (err, user) {
    if (user) {
      if (user.data.application.name) {
        form
          .getTextField("form1[0].Page1[0].Line1b_GivenName[0]")
          .setText(user.data.application.name?.toUpperCase());
      }
      if (user.data.application.family_name) {
        form
          .getTextField("form1[0].Page1[0].Line1a_FamilyName[0]")
          .setText(user.data.application.family_name?.toUpperCase());
      }

      if (user.data.application.middle_name) {
        form
          .getTextField("form1[0].Page1[0].Line1c_MiddleName[0]")
          .setText(user.data.application.middle_name?.toUpperCase());
      }
      // Other name

      if (Array.isArray(user.data.application.other_names)) {
        if (user.data.application.other_names.length > 0) {
          if (user.data.application.other_names[0].sublastname_name) {
            form
              .getTextField("form1[0].Page1[0].Line2a_FamilyName[0]")
              .setText(
                user.data.application.other_names[0].sublastname_name?.toUpperCase()
              );
          }
          if (user.data.application.other_names[0].subfirstname_name) {
            form
              .getTextField("form1[0].Page1[0].Line2b_GivenName[0]")
              .setText(
                user.data.application.other_names[0].subfirstname_name?.toUpperCase()
              );
          }
          if (user.data.application.other_names[0].submiddlename_name) {
            form
              .getTextField("form1[0].Page1[0].Line2c_MiddleName[0]")
              .setText(
                user.data.application.other_names[0].submiddlename_name?.toUpperCase()
              );
          }

          if (user.data.application.other_names.length > 1) {
            if (user.data.application.other_names[1].sublastname_name) {
              form
                .getTextField("form1[0].Page1[0].Line3c_MiddleName[1]")
                .setText(
                  user.data.application.other_names[1].sublastname_name?.toUpperCase()
                );
            }

            if (user.data.application.other_names[1].subfirstname_name) {
              form
                .getTextField("form1[0].Page1[0].Line3b_GivenName[1]")
                .setText(
                  user.data.application.other_names[1].subfirstname_name?.toUpperCase()
                );
            }

            if (user.data.application.other_names[1].submiddlename_name) {
              form
                .getTextField("form1[0].Page1[0].Line3a_FamilyName[1]")
                .setText(
                  user.data.application.other_names[1].submiddlename_name?.toUpperCase()
                );
            }
          }
          if (user.data.application.other_names.length > 2) {
            if (user.data.application.other_names[2].sublastname_name) {
              form
                .getTextField("form1[0].Page1[0].Line3c_MiddleName[0]")
                .setText(
                  user.data.application.other_names[2].sublastname_name?.toUpperCase()
                );
            }
            if (user.data.application.other_names[2].subfirstname_name) {
              form
                .getTextField("form1[0].Page1[0].Line3b_GivenName[0]")
                .setText(
                  user.data.application.other_names[2].subfirstname_name?.toUpperCase()
                );
            }

            if (user.data.application.other_names[2].submiddlename_name) {
              form
                .getTextField("form1[0].Page1[0].Line3a_FamilyName[0]")
                .setText(
                  user.data.application.other_names[2].submiddlename_name?.toUpperCase()
                );
            }
          }
        }
      }

      if (user.data.application.appsignaturedate_name) {
        form
          .getTextField("form1[0].Page5[0].Pt4Line6b_DateofSignature[0]")
          .setText(
            dateFormatter(user.data.application.appsignaturedate_name)
          );
      }

      // Sex

      if (user.data.application.basicinfo_name == "Female") {
        form.getCheckBox("form1[0].Page2[0].Line9_Checkbox[0]").check();
      } else {
        form.getCheckBox("form1[0].Page2[0].Line9_Checkbox[0]").uncheck();
      }
      if (user.data.application.basicinfo_name == "Male") {
        form.getCheckBox("form1[0].Page2[0].Line9_Checkbox[1]").check();
      } else {
        form.getCheckBox("form1[0].Page2[0].Line9_Checkbox[1]").uncheck();
      }

      // Country of citizenship or nationality

      if (Array.isArray(user.data.application.country_names)) {
        if (user.data.application.country_names.length > 0) {
          form
            .getTextField("form1[0].Page2[0].Line17a_CountryOfBirth[0]")
            .setText(
              user.data.application.country_names[0].country_name?.toUpperCase()
            );
        }

        if (user.data.application.country_names.length > 1) {
          form
            .getTextField("form1[0].Page2[0].Line17b_CountryOfBirth[0]")
            .setText(
              user.data.application.country_names[1].country_name?.toUpperCase()
            );
        }
      }

      // Click 1.А

      // if (user.data.application.name) {
      //   form.getCheckBox('form1[0].#subform[3].Pt3Line1Checkbox[1]').check();
      // } else {
      //   form.getCheckBox('form1[0].#subform[3].Pt3Line1Checkbox[1]').uncheck();
      // }

      // 1.А Initial permission to accept employment

      if (user.data.application.name) {
        form.getCheckBox("form1[0].Page1[0].Part1_Checkbox[0]").check();
      } else {
        form.getCheckBox("form1[0].Page1[0].Part1_Checkbox[0]").uncheck();
      }

      // 11. Marital Status

      if (user.data.application.name) {
        form.getCheckBox("form1[0].Page2[0].Line10_Checkbox[3]").check();
      } else {
        form.getCheckBox("form1[0].Page2[0].Line10_Checkbox[3]").uncheck();
      }

      // Is your current mailing address the same as your physical address

      if (user.data.application.mailingaddressus_name == "yes") {
        form.getCheckBox("form1[0].Page2[0].Part2Line5_Checkbox[1]").check();
      } else {
        form
          .getCheckBox("form1[0].Page2[0].Part2Line5_Checkbox[1]")
          .uncheck();
      }

      if (user.data.application.mailingaddressus_name == "no") {
        form.getCheckBox("form1[0].Page2[0].Part2Line5_Checkbox[0]").check();
      } else {
        form
          .getCheckBox("form1[0].Page2[0].Part2Line5_Checkbox[0]")
          .uncheck();
      }

      // Date of birth

      // const bhjasdsa = user.data.application.citizenship_name;
      // if (Array.isArray(bhjasdsa) && bhjasdsa.length) {
      // 	const bhj = new Date(bhjasdsa[0]);
      // 	if (isNaN(bhj) || !bhj) bhj = new Date();
      // 	let date_to_fillvf = (bhj.getMonth() < 9 && '0' || '') + (bhj.getMonth() + 1) + '/';
      // 	date_to_fillvf += (bhj.getDate() < 10 && '0' || '') + bhj.getDate() + '/' + bhj.getFullYear();
      // 	form.getTextField('form1[0].Page3[0].Line19_DOB[0]').setText(date_to_fillvf.toLocaleString());
      // }

      if (user.data.application.citizenship_name) {
        form
          .getTextField("form1[0].Page3[0].Line19_DOB[0]")
          .setText(dateFormatter(user.data.application.citizenship_name));
      }

      // Enter other birth date(s) used

      // Country of birth

      if (user.data.application.birth_name) {
        form
          .getTextField("form1[0].Page3[0].Line18c_CountryOfBirth[0]")
          .setText(user.data.application.birth_name?.toUpperCase());
      }

      // State or province of birth

      if (user.data.application.state_name) {
        form
          .getTextField("form1[0].Page3[0].Line18b_CityTownOfBirth[0]")
          .setText(user.data.application.state_name?.toUpperCase());
      }

      // City or town of birth

      if (user.data.application.city_name) {
        form
          .getTextField("form1[0].Page3[0].Line18a_CityTownOfBirth[0]")
          .setText(user.data.application.city_name?.toUpperCase());
      }

      // JERRY's U.S. social security number

      if (
        user.data.application.securitynumberone_name +
        user.data.application.securitynumbertwo_name +
        user.data.application.securitynumberthree_name
      ) {
        form
          .getTextField("form1[0].Page2[0].Line12b_SSN[0]")
          .setText(
            user.data.application.securitynumberone_name +
              user.data.application.securitynumbertwo_name +
              user.data.application.securitynumberthree_name
          );
      }

      // Daytime phone number

      if (user.data.application.phonenumber_name) {
        form
          .getTextField("form1[0].Page4[0].Pt3Line3_DaytimePhoneNumber1[0]")
          .setText(user.data.application.phonenumber_name?.toUpperCase());
      }

      // Mobile phone number (if any)

      if (user.data.application.mobile_name) {
        form
          .getTextField("form1[0].Page4[0].Pt3Line4_MobileNumber1[0]")
          .setText(user.data.application.mobile_name.toString());
      }

      // Email address (if any)

      if (user.data.application.register_name) {
        form
          .getTextField("form1[0].Page4[0].Pt3Line5_Email[0]")
          .setText(user.data.application.register_name?.toUpperCase());
      }

      // Immigration info

      if (user.data.application.formrecordnumber_name) {
        form
          .getTextField("form1[0].Page3[0].Line20a_I94Number[0]")
          .setText(
            user.data.application.formrecordnumber_name?.toUpperCase()
          );
      }

      if (user.data.application.passportnumberus_name) {
        form
          .getTextField("form1[0].Page3[0].Line20b_Passport[0]")
          .setText(
            user.data.application.passportnumberus_name?.toUpperCase()
          );
      }

      if (user.data.application.travelpassportnumberus_name) {
        form
          .getTextField("form1[0].Page3[0].Line20c_TravelDoc[0]")
          .setText(
            user.data.application.travelpassportnumberus_name?.toUpperCase()
          );
      }

      if (user.data.application.traveluscountry_name) {
        form
          .getTextField("form1[0].Page3[0].Line20d_CountryOfIssuance[0]")
          .setText(user.data.application.traveluscountry_name?.toUpperCase());
      }

      if (user.data.application.uscountry_name) {
        form
          .getTextField("form1[0].Page3[0].Line20d_CountryOfIssuance[0]")
          .setText(user.data.application.uscountry_name?.toUpperCase());
      }

      // const jklljkwqqw = user.data.application.expirationdateus_name;
      // if (Array.isArray(jklljkwqqw) && jklljkwqqw.length) {
      // 	const jklljk = new Date(jklljkwqqw[0]);
      // 	if (isNaN(jklljk) || !jklljk) jklljk = new Date();
      // 	let date_to_fillmj = (jklljk.getMonth() < 9 && '0' || '') + (jklljk.getMonth() + 1) + '/';
      // 	date_to_fillmj += (jklljk.getDate() < 10 && '0' || '') + jklljk.getDate() + '/' + jklljk.getFullYear();
      // 	form.getTextField('form1[0].Page3[0].Line20e_ExpDate[0]').setText(date_to_fillmj.toLocaleString());
      // }

      if (user.data.application.expirationdateus_name) {
        form
          .getTextField("form1[0].Page3[0].Line20e_ExpDate[0]")
          .setText(
            dateFormatter(user.data.application.expirationdateus_name)
          );
      }

      // const hfgfghjaa = user.data.application.travelexpirationdateus_name;
      // if (Array.isArray(hfgfghjaa) && hfgfghjaa.length) {
      // 	const hfgfghj = new Date(hfgfghjaa[0]);
      // 	if (isNaN(hfgfghj) || !hfgfghj) hfgfghj = new Date();
      // 	let date_to_filljm = (hfgfghj.getMonth() < 9 && '0' || '') + (hfgfghj.getMonth() + 1) + '/';
      // 	date_to_filljm += (hfgfghj.getDate() < 10 && '0' || '') + hfgfghj.getDate() + '/' + hfgfghj.getFullYear();
      // 	form.getTextField('form1[0].Page3[0].Line20e_ExpDate[0]').setText(date_to_filljm.toLocaleString());
      // }

      if (user.data.application.travelexpirationdateus_name) {
        form
          .getTextField("form1[0].Page3[0].Line20e_ExpDate[0]")
          .setText(
            dateFormatter(user.data.application.travelexpirationdateus_name)
          );
      }

      // const utyyasdaui = user.data.application.uslastarrivaldate_name;
      // if (Array.isArray(utyyasdaui) && utyyasdaui.length) {
      // 	const utyyui = new Date(utyyasdaui[0]);
      // 	if (isNaN(utyyui) || !utyyui) utyyui = new Date();
      // 	let date_to_fillhy = (utyyui.getMonth() < 9 && '0' || '') + (utyyui.getMonth() + 1) + '/';
      // 	date_to_fillhy += (utyyui.getDate() < 10 && '0' || '') + utyyui.getDate() + '/' + utyyui.getFullYear();
      // 	form.getTextField('form1[0].Page3[0].Line21_DateOfLastEntry[0]').setText(date_to_fillhy.toLocaleString());
      // }

      if (user.data.application.uslastarrivaldate_name) {
        form
          .getTextField("form1[0].Page3[0].Line21_DateOfLastEntry[0]")
          .setText(
            dateFormatter(user.data.application.uslastarrivaldate_name)
          );
      }

      if (user.data.application.name) {
        form
          .getTextField("form1[0].Page3[0].#area[1].section_1[0]")
          .setText("c");
      }

      if (user.data.application.name) {
        form
          .getTextField("form1[0].Page3[0].#area[1].section_2[0]")
          .setText("9");
      }

      if (user.data.application.name) {
        form
          .getTextField("form1[0].Page3[0].#area[1].section_3[0]")
          .setText("i");
      }

      if (user.data.application.name) {
        form.getCheckBox("form1[0].Page4[0].Pt3Line1Checkbox[1]").check();
      }

      if (user.data.application.form94middleqqq_name) {
        form
          .getTextField("form1[0].Page3[0].Line24_CurrentStatus[0]")
          .setText(user.data.application.form94middleqqq_name?.toUpperCase());
      }

      if (user.data.application.form94middleform_name) {
        form
          .getTextField("form1[0].Page3[0].Line23_StatusLastEntry[0]")
          .setText(
            user.data.application.form94middleform_name?.toUpperCase()
          );
      }

      if (user.data.application.uscityoftawn_name) {
        form
          .getTextField("form1[0].Page3[0].place_entry[0]")
          .setText(user.data.application.uscityoftawn_name?.toUpperCase());
      }

      if (user.data.application.usvisitor_name) {
        form
          .getTextField("form1[0].Page3[0].Line26_SEVISnumber[0]")
          .setText(
            user.data.application.usvisitor_name?.toUpperCase()?.slice(0, 11)
          );
      }

      // 2

      if (user.data.application.socialsecuritycard_name == "no") {
        form.getCheckBox("form1[0].Page2[0].Line13_Checkbox[0]").check();
      } else {
        form.getCheckBox("form1[0].Page2[0].Line13_Checkbox[0]").uncheck();
      }

      if (user.data.application.socialsecuritycard_name == "yes") {
        form.getCheckBox("form1[0].Page2[0].Line13_Checkbox[1]").check();
      } else {
        form.getCheckBox("form1[0].Page2[0].Line13_Checkbox[1]").uncheck();
      }

      // 3

      if (user.data.application.consentfordisclosure_name == "no") {
        form.getCheckBox("form1[0].Page2[0].Line14_Checkbox_No[0]").check();
      } else {
        form.getCheckBox("form1[0].Page2[0].Line14_Checkbox_No[0]").uncheck();
      }

      if (user.data.application.consentfordisclosure_name == "yes") {
        form.getCheckBox("form1[0].Page2[0].Line14_Checkbox_Yes[0]").check();
      } else {
        form
          .getCheckBox("form1[0].Page2[0].Line14_Checkbox_Yes[0]")
          .uncheck();
      }

      if (user.data.application.usregistrationnumber_name) {
        form
          .getTextField("form1[0].Page2[0].Line7_AlienNumber[0]")
          .setText(user.data.application.usregistrationnumber_name);
      }

      if (user.data.application.filedapetition_name) {
        form
          .getTextField("form1[0].Page2[0].Line8_ElisAccountNumber[0]")
          .setText(user.data.application.filedapetition_name);
      }

      // Place of last arrival

      // City or town

      // State

      // Date of last arrival

      // const bhsdjqqaaa = user.data.application.uslastarrival_name;
      // if (Array.isArray(bhsdjqqaaa) && bhsdjqqaaa.length) {
      // 	const bhjqq = new Date(bhsdjqqaaa[0]);
      // 	if (isNaN(bhjqq) || !bhjqq) bhjqq = new Date();
      // 	let date_to_fillws = (bhjqq.getMonth() < 9 && '0' || '') + (bhjqq.getMonth() + 1) + '/';
      // 	date_to_fillws += (bhjqq.getDate() < 10 && '0' || '') + bhjqq.getDate() + '/' + bhjqq.getFullYear();
      // 	form.getTextField('form1[0].Page3[0].Line21_DateOfLastEntry[0]').setText(date_to_fillws.toLocaleString());
      // }

      if (user.data.application.uslastarrival_name) {
        form
          .getTextField("form1[0].Page3[0].Line21_DateOfLastEntry[0]")
          .setText(dateFormatter(user.data.application.uslastarrival_name));
      }

      // JERRY's Alien registration number (A-number) (if any)

      if (user.data.application.usregistrationnumber_name) {
        form
          .getTextField("form1[0].Page2[0].Line7_AlienNumber[0]")
          .setText(
            user.data.application.usregistrationnumber_name?.toUpperCase()
          );
      }

      //Family

      // /A little about jerry's mother

      // Given name (first name)

      if (user.data.application.mother_name) {
        form
          .getTextField("form1[0].Page2[0].Line16b_GivenName[0]")
          .setText(user.data.application.mother_name?.toUpperCase());
      }

      // Family name (last name)

      if (user.data.application.mother_family_name) {
        form
          .getTextField("form1[0].Page2[0].Line16a_FamilyName[0]")
          .setText(user.data.application.mother_family_name?.toUpperCase());
      }

      // Now about jerry's father

      // /A little about jerry's mother

      // Given name (first name)

      if (user.data.application.father_name) {
        form
          .getTextField("form1[0].Page2[0].Line15b_GivenName[0]")
          .setText(user.data.application.father_name?.toUpperCase());
      }

      // Family name (last name)

      if (user.data.application.father_family_name) {
        form
          .getTextField("form1[0].Page2[0].Line15a_FamilyName[0]")
          .setText(user.data.application.father_family_name?.toUpperCase());
      }

      // Places lived

      // Enter jerry's mailing address inside the U.S.:

      // In care of name (if any)

      if (user.data.application.mailing_name) {
        form
          .getTextField("form1[0].Page2[0].Line4a_InCareofName[0]")
          .setText(user.data.application.mailing_name?.toUpperCase());
      }

      // Street number and name

      if (user.data.application.mailingnumber_name) {
        form
          .getTextField("form1[0].Page2[0].Line4b_StreetNumberName[0]")
          .setText(user.data.application.mailingnumber_name?.toUpperCase());
      }

      // Apt./Ste./Flr. Number (if any)

      if (user.data.application.apt_name == "steaplase") {
        form.getCheckBox("form1[0].Page2[0].Pt2Line5_Unit[0]").check();
      } else {
        form.getCheckBox("form1[0].Page2[0].Pt2Line5_Unit[0]").uncheck();
      }

      if (user.data.application.apt_name == "flrpalase") {
        form.getCheckBox("form1[0].Page2[0].Pt2Line5_Unit[1]").check();
      } else {
        form.getCheckBox("form1[0].Page2[0].Pt2Line5_Unit[1]").uncheck();
      }

      if (user.data.application.apt_name == "aptplase") {
        form.getCheckBox("form1[0].Page2[0].Pt2Line5_Unit[2]").check();
      } else {
        form.getCheckBox("form1[0].Page2[0].Pt2Line5_Unit[2]").uncheck();
      }

      if (user.data.application.selectste_name) {
        form
          .getTextField("form1[0].Page2[0].Pt2Line5_AptSteFlrNumber[0]")
          .setText(user.data.application.selectste_name?.toUpperCase());
      }

      // City or town

      if (user.data.application.mailingcity_name) {
        form
          .getTextField("form1[0].Page2[0].Pt2Line5_CityOrTown[0]")
          .setText(user.data.application.mailingcity_name?.toUpperCase());
      }

      // State

      if (user.data.application.insidemailingprovince_name) {
        form
          .getDropdown("form1[0].Page2[0].Pt2Line5_State[0]")
          .select(
            user.data.application.insidemailingprovince_name?.toUpperCase()
          );
      }

      // ZIP code

      if (user.data.application.mailingpostalcode_name) {
        form
          .getTextField("form1[0].Page2[0].Pt2Line5_ZipCode[0]")
          .setText(
            user.data.application.mailingpostalcode_name?.toUpperCase()
          );
      }

      // About jerry's physical address inside the U.S.

      if (user.data.application.applicationforus_name == "no") {
        form.getCheckBox("form1[0].Page2[0].Line19_Checkbox[0]").check();
      } else {
        form.getCheckBox("form1[0].Page2[0].Line19_Checkbox[0]").uncheck();
      }

      if (user.data.application.applicationforus_name == "yes") {
        form.getCheckBox("form1[0].Page2[0].Line19_Checkbox[1]").check();
      } else {
        form.getCheckBox("form1[0].Page2[0].Line19_Checkbox[1]").uncheck();
      }

      // Street number and name

      if (user.data.application.insideusnumber_name) {
        form
          .getTextField("form1[0].Page2[0].Pt2Line7_StreetNumberName[0]")
          .setText(user.data.application.insideusnumber_name?.toUpperCase());
      }

      // Apt./Ste./Flr. Number (if any)

      if (user.data.application.insideusifany_name == "Ste") {
        form.getCheckBox("form1[0].Page2[0].Pt2Line7_Unit[0]").check();
      } else {
        form.getCheckBox("form1[0].Page2[0].Pt2Line7_Unit[0]").uncheck();
      }

      if (user.data.application.insideusifany_name == "Flr") {
        form.getCheckBox("form1[0].Page2[0].Pt2Line7_Unit[1]").check();
      } else {
        form.getCheckBox("form1[0].Page2[0].Pt2Line7_Unit[1]").uncheck();
      }

      if (user.data.application.insideusifany_name == "Apt") {
        form.getCheckBox("form1[0].Page2[0].Pt2Line7_Unit[2]").check();
      } else {
        form.getCheckBox("form1[0].Page2[0].Pt2Line7_Unit[2]").uncheck();
      }

      if (user.data.application.usifanyselest_name) {
        form
          .getTextField("form1[0].Page2[0].Pt2Line7_AptSteFlrNumber[0]")
          .setText(user.data.application.usifanyselest_name?.toUpperCase());
      }

      // City or town

      if (user.data.application.insideusgcity_name) {
        form
          .getTextField("form1[0].Page2[0].Pt2Line7_CityOrTown[0]")
          .setText(user.data.application.insideusgcity_name?.toUpperCase());
      }

      // State

      if (user.data.application.administration_name == "no") {
        form.getCheckBox("form1[0].Page2[0].Line12a_Checkbox[0]").check();
      } else {
        form.getCheckBox("form1[0].Page2[0].Line12a_Checkbox[0]").uncheck();
      }

      if (user.data.application.administration_name == "yes") {
        form.getCheckBox("form1[0].Page2[0].Line12a_Checkbox[1]").check();
      } else {
        form.getCheckBox("form1[0].Page2[0].Line12a_Checkbox[1]").uncheck();
      }

      if (user.data.application.family_name) {
        form
          .getTextField("form1[0].Page7[0].Line1a_FamilyName[0]")
          .setText(user.data.application.family_name?.toUpperCase());
      }

      if (user.data.application.name) {
        form
          .getTextField("form1[0].Page7[0].Line1b_GivenName[0]")
          .setText(user.data.application.name?.toUpperCase());
      }

      if (user.data.application.middle_name) {
        form
          .getTextField("form1[0].Page7[0].Line1c_MiddleName[0]")
          .setText(user.data.application.middle_name?.toUpperCase());
      }
      if (user.data.application.usregistrationnumber_name) {
        form
          .getTextField("form1[0].Page7[0].Line7_AlienNumber[0]")
          .setText(
            user.data.application.usregistrationnumber_name?.toUpperCase()
          );
      }

      if (user.data.application.name) {
        form
          .getTextField("form1[0].Page7[0].Pt6Line3a_PageNumber[0]")
          .setText("1");
      }
      if (user.data.application.name) {
        form
          .getTextField("form1[0].Page7[0].Pt6Line3b_PartNumber[0]")
          .setText("2");
      }
      if (user.data.application.name) {
        form
          .getTextField("form1[0].Page7[0].Pt6Line3c_ItemNumber[0]")
          .setText("2");
      }

      if (user.data.application.name) {
        form
          .getTextField("form1[0].Page7[0].Pt6Line4a_PageNumber[0]")
          .setText("1");
      }
      if (user.data.application.name) {
        form
          .getTextField("form1[0].Page7[0].Pt6Line4b_PartNumber[0]")
          .setText("2");
      }
      if (user.data.application.name) {
        form
          .getTextField("form1[0].Page7[0].Pt6Line4c_ItemNumber[0]")
          .setText("2");
      }

      if (user.data.application.name) {
        form
          .getTextField("form1[0].Page7[0].Pt6Line5a_PageNumber[0]")
          .setText("2");
      }
      if (user.data.application.name) {
        form
          .getTextField("form1[0].Page7[0].Pt6Line5b_PartNumber[0]")
          .setText("2");
      }
      if (user.data.application.name) {
        form
          .getTextField("form1[0].Page7[0].Pt6Line5c_ItemNumber[0]")
          .setText("18");
      }

      if (user.data.application.other_names.length) {
        let qwe = "";

        if (user.data.application.other_names[3]?.subfirstname_name)
          // res.push(user.data.application.other_names[1].employer_name)
          qwe += `${user.data.application.other_names[3].subfirstname_name}, `;

        if (user.data.application.other_names[3]?.submiddlename_name)
          // res.push(user.data.application.other_names[3].empmailingnumber_name)
          qwe += `${user.data.application.other_names[3].submiddlename_name}, `;

        if (user.data.application.other_names[3]?.sublastname_name)
          // res.push(user.data.application.other_names[3].asfnumberus_name)
          qwe += `${user.data.application.other_names[3].sublastname_name} \n`;

        if (user.data.application.other_names[4]?.subfirstname_name)
          // res.push(user.data.application.other_names[1].employer_name)
          qwe += `${user.data.application.other_names[4].subfirstname_name}, `;

        if (user.data.application.other_names[4]?.submiddlename_name)
          // res.push(user.data.application.other_names[4].empmailingnumber_name)
          qwe += `${user.data.application.other_names[4].submiddlename_name}, `;

        if (user.data.application.other_names[4]?.sublastname_name)
          // res.push(user.data.application.other_names[4].asfnumberus_name)
          qwe += `${user.data.application.other_names[4].sublastname_name} `;

        form
          .getTextField("form1[0].Page7[0].Pt6Line4d_AdditionalInfo[1]")
          .setText(qwe?.toUpperCase());
      }

      if (user.data.application.other_names.length) {
        let qwe = "";

        if (user.data.application.other_names[5]?.subfirstname_name)
          // res.push(user.data.application.other_names[1].employer_name)
          qwe += `${user.data.application.other_names[5].subfirstname_name}, `;

        if (user.data.application.other_names[5]?.submiddlename_name)
          // res.push(user.data.application.other_names[5].empmailingnumber_name)
          qwe += `${user.data.application.other_names[5].submiddlename_name}, `;

        if (user.data.application.other_names[5]?.sublastname_name)
          // res.push(user.data.application.other_names[5].asfnumberus_name)
          qwe += `${user.data.application.other_names[5].sublastname_name} \n`;

        if (user.data.application.other_names[6]?.subfirstname_name)
          // res.push(user.data.application.other_names[1].employer_name)
          qwe += `${user.data.application.other_names[6].subfirstname_name}, `;

        if (user.data.application.other_names[6]?.submiddlename_name)
          // res.push(user.data.application.other_names[6].empmailingnumber_name)
          qwe += `${user.data.application.other_names[6].submiddlename_name}, `;

        if (user.data.application.other_names[6]?.sublastname_name)
          // res.push(user.data.application.other_names[6].asfnumberus_name)
          qwe += `${user.data.application.other_names[6].sublastname_name} `;

        form
          .getTextField("form1[0].Page7[0].Pt6Line4d_AdditionalInfo[0]")
          .setText(qwe?.toUpperCase());
      }

      if (user.data.application.country_names?.length) {
        let qwe = "";

        if (user.data.application.country_names[2]?.country_name)
          // res.push(user.data.application.country_names[2].employer_name)
          qwe += `${user.data.application.country_names[2].country_name}`;

        form
          .getTextField("form1[0].Page7[0].Pt6Line5d_AdditionalInfo[0]")
          .setText(qwe?.toUpperCase());
      }

      if (user.data.application.insideusstate_name) {
        form
          .getDropdown("form1[0].Page2[0].Pt2Line7_State[0]")
          .select(user.data.application.insideusstate_name);
      }

      // ZIP code

      if (user.data.application.insideuscode_name) {
        form
          .getTextField("form1[0].Page2[0].Pt2Line7_ZipCode[0]")
          .setText(user.data.application.insideuscode_name?.toUpperCase());
      }

      let src = `${__dirname}/pdf_forms/i-765_done.pdf`;
      const pdfBytes = await pdfDoc.save();
      fs.writeFileSync(src, Buffer.from(pdfBytes));
      res.sendFile(src);
    }
  });
    
}

const pdfDownload864 = async (req, res) => {

    const existingPdfBytes = fs.readFileSync(`${__dirname}/pdf_forms/i-864.pdf`);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const form = pdfDoc.getForm();
    //temp
    const fields = form.getFields();
    fields.forEach((field) => {
        const name = field.getName();
        console.log(`${name} `);
    });
    //temp
    Data.findOne({
        _id: req.params.user_id,
    }).exec(async function (err, user) {
        if (user) {
        if (user.data.application.mailingaddressus_name === "no") {
            if (user.data.application.insponsorincare_name) {
            form
                .getTextField("form1[0].#subform[0].P2_Line2_InCareOf[0]")
                .setText(
                user.data.application.insponsorincare_name?.toUpperCase()
                );
            }

            // Street number and name

            if (user.data.application.insideusnumber_name) {
            form
                .getTextField("form1[0].#subform[0].P2_Line2_StreetNumberName[0]")
                .setText(
                user.data.application.insideusnumber_name
                    ?.toUpperCase()
                    ?.slice(0, 25)
                );
            }

            // Apt./Ste./Flr. Number (if any)

            if (user.data.application.insideusifany_name == "Flr") {
            form.getCheckBox("form1[0].#subform[0].P2_Line2_Unit[0]").check();
            } else {
            form.getCheckBox("form1[0].#subform[0].P2_Line2_Unit[0]").uncheck();
            }

            if (user.data.application.insideusifany_name == "Ste") {
            form.getCheckBox("form1[0].#subform[0].P2_Line2_Unit[1]").check();
            } else {
            form.getCheckBox("form1[0].#subform[0].P2_Line2_Unit[1]").uncheck();
            }

            if (user.data.application.insideusifany_name == "Apt") {
            form.getCheckBox("form1[0].#subform[0].P2_Line2_Unit[2]").check();
            } else {
            form.getCheckBox("form1[0].#subform[0].P2_Line2_Unit[2]").uncheck();
            }

            if (user.data.application.usifanyselest_name) {
            form
                .getTextField("form1[0].#subform[0].P2_Line2_AptSteFlrNumber[0]")
                .setText(user.data.application.usifanyselest_name?.toUpperCase());
            }

            // City or town

            if (user.data.application.insideusgcity_name) {
            form
                .getTextField("form1[0].#subform[0].P2_Line2_CityOrTown[0]")
                .setText(user.data.application.insideusgcity_name?.toUpperCase());
            }

            // State

            if (user.data.application.insideusstate_name) {
            form
                .getDropdown("form1[0].#subform[0].P2_Line2_State[0]")
                .select(user.data.application.insideusstate_name);
            }

            // Zip Code

            if (user.data.application.insideuscode_name) {
            form
                .getTextField("form1[0].#subform[0].P2_Line2_ZipCode[0]")
                .setText(user.data.application.insideuscode_name?.toUpperCase());
            }

            if (user.data.application.physicaladdresssponsor_name === "USA") {
            form
                .getTextField("form1[0].#subform[2].P4_Line4h_Country[0]")
                .setText("USA"?.toUpperCase());
            }

            if (user.data.application.placemailingcountry_name) {
            form
                .getTextField("form1[0].#subform[2].P4_Line4h_Country[0]")
                .setText(
                user.data.application.placemailingcountry_name?.toUpperCase()
                );
            }
        }

        if (user.data.application.mailingaddress_name === "USA") {
            form
            .getTextField("form1[0].#subform[0].P2_Line2_Country[0]")
            .setText("USA"?.toUpperCase());
        }

        if (user.data.application.mailingaddressus_name !== "no") {
            if (user.data.application.insponsorincare_name) {
            form
                .getTextField("form1[0].#subform[0].P2_Line2_InCareOf[0]")
                .setText(
                user.data.application.insponsorincare_name?.toUpperCase()
                );
            }

            // Street number and name

            if (user.data.application.mailingnumber_name) {
            form
                .getTextField("form1[0].#subform[0].P2_Line2_StreetNumberName[0]")
                .setText(
                user.data.application.mailingnumber_name
                    ?.toUpperCase()
                    ?.slice(0, 25)
                );
            }

            // Apt./Ste./Flr. Number (if any)

            if (user.data.application.apt_name == "aptplase") {
            form.getCheckBox("form1[0].#subform[0].P2_Line2_Unit[0]").check();
            } else {
            form.getCheckBox("form1[0].#subform[0].P2_Line2_Unit[0]").uncheck();
            }

            if (user.data.application.apt_name == "steaplase") {
            form.getCheckBox("form1[0].#subform[0].P2_Line2_Unit[1]").check();
            } else {
            form.getCheckBox("form1[0].#subform[0].P2_Line2_Unit[1]").uncheck();
            }

            if (user.data.application.apt_name == "flrpalase") {
            form.getCheckBox("form1[0].#subform[0].P2_Line2_Unit[2]").check();
            } else {
            form.getCheckBox("form1[0].#subform[0].P2_Line2_Unit[2]").uncheck();
            }

            if (user.data.application.usifanyselest_name) {
            form
                .getTextField("form1[0].#subform[0].P2_Line2_AptSteFlrNumber[0]")
                .setText(user.data.application.usifanyselest_name?.toUpperCase());
            }

            // City or town

            if (user.data.application.mailingcity_name) {
            form
                .getTextField("form1[0].#subform[0].P2_Line2_CityOrTown[0]")
                .setText(user.data.application.mailingcity_name?.toUpperCase());
            }

            // State

            if (user.data.application.insidemailingprovince_name) {
            form
                .getDropdown("form1[0].#subform[0].P2_Line2_State[0]")
                .select(user.data.application.insidemailingprovince_name);
            }

            // Zip Code

            if (user.data.application.mailingpostalcode_name) {
            form
                .getTextField("form1[0].#subform[0].P2_Line2_ZipCode[0]")
                .setText(user.data.application.mailingpostalcode_name);
            }

        }

        if (user.data.application.sponsortypeaddress_name === "USA") {
            form
            .getTextField("form1[0].#subform[2].P4_Line2i_Country[0]")
            .setText("USA"?.toUpperCase());
        }

        if (user.data.application.insidecountrysponsorus_name) {
            form
            .getTextField("form1[0].#subform[2].P4_Line2i_Country[0]")
            .setText(
                user.data.application.insidecountrysponsorus_name?.toUpperCase()
            );
        }


        let sponsorname = user.data.application.sponsorname || "";
        if (user.data.application.sponsormiddle_name)
            sponsorname += " " + user.data.application.sponsormiddle_name;
        if (user.data.application.sponsorfamily_name)
            sponsorname += " " + user.data.application.sponsorfamily_name;
        form
            .getTextField("form1[0].#subform[0].P1_Line1_Name[0]")
            .setText(sponsorname?.toUpperCase());

        if (user.data.application.name) {
            form
            .getTextField("form1[0].#subform[3].P5_Line1_Number[0]")
            .setText("1"?.toUpperCase());
        }

        if (user.data.application.name) {
            form
            .getTextField("form1[0].#subform[0].P2_Line1b_GivenName[0]")
            .setText(user.data.application.name?.toUpperCase());
        }

        if (user.data.application.family_name) {
            form
            .getTextField("form1[0].#subform[0].P2_Line1a_FamilyName[0]")
            .setText(user.data.application.family_name?.toUpperCase());
        }

        if (user.data.application.middle_name) {
            form
            .getTextField("form1[0].#subform[0].P2_Line1c_MiddleName[0]")
            .setText(user.data.application.middle_name?.toUpperCase());
        }

        if (user.data.application.name) {
            form
            .getCheckBox("form1[0].#subform[0].P1_Line1a_Checkbox[0]")
            .check();
        }

        if (user.data.application.sponsorname) {
            form.getCheckBox("form1[0].#subform[1].P3_Line1_Checkbox[0]").check();
        }

        // A photocopy from 222's own records of 222's Federal individual income tax return

        if (user.data.application.servicetranscript_name) {
            form
            .getCheckBox("form1[0].#subform[4].P6_Line18a_Checkbox[0]")
            .check();
        }

        if (Array.isArray(user.data.application.country_names)) {
            if (user.data.application.country_names.length) {
            form
                .getTextField(
                "form1[0].#subform[0].P2_Line3_CountryOfCitenship[0]"
                )
                .setText(
                user.data.application.country_names[0]?.country_name?.toUpperCase()
                );
            }
        }


        if (user.data.application.citizenship_name) {
            form
            .getTextField("form1[0].#subform[0].P2_Line4_DateOfBirth[0]")
            .setText(dateFormatter(user.data.application.citizenship_name));
        }

        // Daytime phone number

        if (user.data.application.phonenumber_name) {
            form
            .getTextField(
                "form1[0].#subform[0].P2_Line7_DaytimeTelephoneNumber[0]"
            )
            .setText(user.data.application.phonenumber_name);
        }

        // JERRY's Alien registration number (A-number) (if any)

        if (user.data.application.usregistrationnumber_name) {
            form
            .getTextField(
                "form1[0].#subform[0].#area[1].P2_Line5_AlienNumber[0]"
            )
            .setText(user.data.application.usregistrationnumber_name);
        }

        // JERRY's USCIS Online Account Number (if any)

        if (user.data.application.filedapetition_name) {
            form
            .getTextField(
                "form1[0].#subform[0].#area[2].Pt2Line6_USCISOnlineAcctNumber[0]"
            )
            .setText(user.data.application.filedapetition_name);
        }

        // greencart

        if (user.data.cardholder === "us") {
            form
            .getCheckBox("form1[0].#subform[2].P4_Line11a_Checkbox[0]")
            .check();
        } else {
            form
            .getCheckBox("form1[0].#subform[2].P4_Line11a_Checkbox[0]")
            .uncheck();
        }

        if (user.data.cardholder === "greencard") {
            form
            .getCheckBox("form1[0].#subform[2].P4_Line11c_Checkbox[0]")
            .check();
        } else {
            form
            .getCheckBox("form1[0].#subform[2].P4_Line11c_Checkbox[0]")
            .uncheck();
        }

        // SSN

        if (
            user.data.application.sponsorsecuritynumberone_name +
            user.data.application.sponsorsecuritynumbertwo_name +
            user.data.application.sponsorsecuritynumberthree_name
        ) {
            form
            .getTextField(
                "form1[0].#subform[2].P4_Line10_SocialSecurityNumber[0]"
            )
            .setText(
                user.data.application.sponsorsecuritynumberone_name +
                user.data.application.sponsorsecuritynumbertwo_name +
                user.data.application.sponsorsecuritynumberthree_name
            );
        }

        // ALIEN

        if (user.data.application.anumbersponsor_name) {
            form
            .getTextField(
                "form1[0].#subform[2].Line11c_AlienNumberGroup[0].P4_Line12_AlienNumber[0]"
            )
            .setText(user.data.application.anumbersponsor_name?.toUpperCase());
        }

        // ALIEN 2

        if (user.data.application.anumbersponsoraccount_name) {
            form
            .getTextField(
                "form1[0].#subform[2].#area[14].P4_Line13_AcctIdentifier[0]"
            )
            .setText(
                user.data.application.anumbersponsoraccount_name?.toUpperCase()
            );
        }

        // Places lived

        // In care of name (if any)

        if (user.data.application.mailing_name) {
            form
            .getTextField("form1[0].#subform[0].P2_Line2_InCareOf[0]")
            .setText(user.data.application.mailing_name?.toUpperCase());
        }

        if (user.data.application.selectste_name) {
            form
            .getTextField("form1[0].#subform[0].P2_Line2_AptSteFlrNumber[0]")
            .setText(user.data.application.selectste_name?.toUpperCase());
        }

        // City or town

        if (user.data.application.mailingcity_name) {
            form
            .getTextField("form1[0].#subform[0].P2_Line2_CityOrTown[0]")
            .setText(user.data.application.mailingcity_name?.toUpperCase());
        }

        // State

        if (user.data.application.insidemailingprovince_name) {
            form
            .getDropdown("form1[0].#subform[0].P2_Line2_State[0]")
            .select(user.data.application.insidemailingprovince_name);
        }

        // Zip code

        if (user.data.application.mailingpostalcode_name) {
            form
            .getTextField("form1[0].#subform[0].P2_Line2_ZipCode[0]")
            .setText(user.data.application.mailingpostalcode_name);
        }
        // Sponsor info

        // Personal Info

        if (user.data.application.sponsorname) {
            form
            .getTextField("form1[0].#subform[2].P4_Line1b_GivenName[0]")
            .setText(user.data.application.sponsorname?.toUpperCase());
        }

        if (user.data.application.sponsormiddle_name) {
            form
            .getTextField("form1[0].#subform[2].P4_Line1c_MiddleName[0]")
            .setText(user.data.application.sponsormiddle_name?.toUpperCase());
        }

        if (user.data.application.sponsorfamily_name) {
            form
            .getTextField("form1[0].#subform[2].P4_Line1a_FamilyName[0]")
            .setText(user.data.application.sponsorfamily_name?.toUpperCase());
        }

        // if (user.data.application.insaidedateofbirrth_name) {
        //     form
        //     .getTextField("form1[0].#subform[2].P4_Line6_DateOfBirth[0]")
        //     .setText(
        //         dateFormatter(user.data.application.insaidedateofbirrth_name)
        //     );
        // }
        // Country of birth

        if (user.data.application.ofinsidesponsorbirth_name) {
            form
            .getTextField("form1[0].#subform[2].P4_Line9_CountryOfBirth[0]")
            .setText(
                user.data.application.ofinsidesponsorbirth_name?.toUpperCase()
            );
        }

        // State or province of birth

        if (user.data.application.insideorprovince_name) {
            form
            .getTextField(
                "form1[0].#subform[2].P4_Line8_StateorProvinceofBirth[0]"
            )
            .setText(
                user.data.application.insideorprovince_name?.toUpperCase()
            );
        }

        // City/town/village of birth

        if (user.data.application.cityinside_name) {
            form
            .getTextField("form1[0].#subform[2].P4_Line7_CityofBirth[0]")
            .setText(
                user.data.application.cityinside_name?.toUpperCase()?.slice(0, 20)
            );
        }

        // DATE 1

        if (user.data.application.citidatedid_name) {
            form
            .getTextField("form1[0].#subform[3].P6_Line5a_DateRetired[0]")
            .setText(dateFormatter(user.data.application.citidatedid_name));
        }

        // DATE 2

        if (user.data.application.employmentbeenunemployed_name) {
            form
            .getTextField(
                "form1[0].#subform[3].P6_Line6a_DateofUnemployment[0]"
            )
            .setText(
                dateFormatter(user.data.application.employmentbeenunemployed_name)
            );
        }

        // Is CHUKS currently on active duty in the U.S. Armed Forces or U.S. Coast Guard?

        console.log(user.data.application.calcresult);
        if (user.data.application.calcresult) {
            form
            .getTextField("form1[0].#subform[3].Override[0]")
            .setText(user.data.application.calcresult.toString());
        }

        if (user.data.application.employmenthistory_name) {
            form.getCheckBox("form1[0].#subform[3].P6_Line6_Checkbox[0]").check();
        }

        if (user.data.application.sponsoradministration_name === "yes") {
            form.getCheckBox("form1[0].#subform[3].P6_Line5_Checkbox[0]").check();
        }

        if (user.data.application.employmentbeenunemployed_name) {
            form
            .getTextField(
                "form1[0].#subform[3].P6_Line6a_DateofUnemployment[0]"
            )
            .setText(
                dateFormatter(user.data.application.employmentbeenunemployed_name)
            );
        }

        if (user.data.application.sponsoradministration_name == "no") {
            form
            .getCheckBox("form1[0].#subform[2].P4_Line14_Checkboxes[0]")
            .check();
        } else {
            form
            .getCheckBox("form1[0].#subform[2].P4_Line14_Checkboxes[0]")
            .uncheck();
        }

        if (user.data.application.sponsoradministration_name == "yes") {
            form
            .getCheckBox("form1[0].#subform[2].P4_Line14_Checkboxes[1]")
            .check();
        } else {
            form
            .getCheckBox("form1[0].#subform[2].P4_Line14_Checkboxes[1]")
            .uncheck();
        }


        if (user.data.application.phonenumbersponsor_name) {
            form
            .getTextField(
                "form1[0].#subform[9].P8_Line3_DaytimeTelephoneNumber[0]"
            )
            .setText(user.data.application.phonenumbersponsor_name);
        }

        // Mobile phone number (if any)

        if (user.data.application.insponsormobile_name) {
            form
            .getTextField(
                "form1[0].#subform[9].P8_Line4_MobileTelephoneNumber[0]"
            )
            .setText(user.data.application.insponsormobile_name);
        }

        // Email address (if any)

        if (user.data.application.insponsoremail_name) {
            form
            .getTextField("form1[0].#subform[9].P7Line7_EmailAddress[0]")
            .setText(user.data.application.insponsoremail_name?.toUpperCase());
        }

        if (user.data.application.insponsorincare_name) {
            form
            .getTextField("form1[0].#subform[2].P4_Line2a_InCareOf[0]")
            .setText(user.data.application.insponsorincare_name?.toUpperCase());
        }

        // Street number and name

        if (user.data.application.inphysicalstreetsponsor_name) {
            form
            .getTextField("form1[0].#subform[2].P4_Line2b_StreetNumberName[0]")
            .setText(
                user.data.application.inphysicalstreetsponsor_name
                ?.toUpperCase()
                ?.slice(0, 25)
            );
        }

        // Apt./Ste./Flr. Number (if any)

        if (user.data.application.physicalusaptsponsor_name == "Apt") {
            form.getCheckBox("form1[0].#subform[2].P4_Line2c_Unit[0]").check();
        } else {
            form.getCheckBox("form1[0].#subform[2].P4_Line2c_Unit[0]").uncheck();
        }

        if (user.data.application.physicalusaptsponsor_name == "Ste") {
            form.getCheckBox("form1[0].#subform[2].P4_Line2c_Unit[1]").check();
        } else {
            form.getCheckBox("form1[0].#subform[2].P4_Line2c_Unit[1]").uncheck();
        }

        if (user.data.application.physicalusaptsponsor_name == "Flr") {
            form.getCheckBox("form1[0].#subform[2].P4_Line2c_Unit[2]").check();
        } else {
            form.getCheckBox("form1[0].#subform[2].P4_Line2c_Unit[2]").uncheck();
        }

        // if (user.data.application.physicalusstesponsor_name) {
        //     form
        //     .getTextField("form1[0].#subform[2].P4_Line2c_AptSteFlrNumber[0]")
        //     .setText(
        //         user.data.application.physicalusstesponsor_name?.toUpperCase()
        //     );
        // }

        // City or town

        if (user.data.application.physicalcitysponsorus_name) {
            form
            .getTextField("form1[0].#subform[2].P4_Line2d_CityOrTown[0]")
            .setText(
                user.data.application.physicalcitysponsorus_name?.toUpperCase()
            );
        }

        // State

        if (user.data.application.physicalusprovincesponsorin_name) {
            form
            .getDropdown("form1[0].#subform[2].P4_Line2e_State[0]")
            .select(user.data.application.physicalusprovincesponsorin_name);
        }

        // Province

        if (user.data.application.provinceusinside_name) {
            form
            .getTextField("form1[0].#subform[2].P4_Line2g_Province[0]")
            .setText(
                user.data.application.provinceusinside_name?.toUpperCase()
            );
        }

        // Postal code

        if (user.data.application.postalcodeinsideus_name) {
            form
            .getTextField("form1[0].#subform[2].P4_Line2h_PostalCode[0]")
            .setText(
                user.data.application.postalcodeinsideus_name?.toUpperCase()
            );
        }

        // Zip Code

        if (user.data.application.usinsidezipcode_name) {
            form
            .getTextField("form1[0].#subform[2].P4_Line2f_ZipCode[0]")
            .setText(user.data.application.usinsidezipcode_name?.toUpperCase());
        }


        if (user.data.application.sponsorphysicaladdress_name == "yes") {
            form.getCheckBox("form1[0].#subform[2].P4_Line3_Checkbox[1]").check();
        } else {
            form
            .getCheckBox("form1[0].#subform[2].P4_Line3_Checkbox[1]")
            .uncheck();
        }

        if (user.data.application.sponsorphysicaladdress_name == "no") {
            form.getCheckBox("form1[0].#subform[2].P4_Line3_Checkbox[0]").check();
        } else {
            form
            .getCheckBox("form1[0].#subform[2].P4_Line3_Checkbox[0]")
            .uncheck();
        }

        // Information About the Immigrants You Are Sponsoring

        if (user.data.application.name) {
            form
            .getTextField(
                "form1[0].#subform[2].P3_Line28_TotalNumberofImmigrants[0]"
            )
            .setText("1");
        }

        // Street number and name
        if (user.data.application.streetsponsorandname_name) {
            form
            .getTextField("form1[0].#subform[2].P4_Line4a_StreetNumberName[0]")
            .setText(
                user.data.application.streetsponsorandname_name?.toUpperCase()
            );
        }

        // Apt./Ste./Flr. Number (if any)

        if (user.data.application.physicalaptsponsor_name == "Apt") {
            form.getCheckBox("form1[0].#subform[2].P4_Line4b_Unit[0]").check();
        } else {
            form.getCheckBox("form1[0].#subform[2].P4_Line4b_Unit[0]").uncheck();
        }

        if (user.data.application.physicalaptsponsor_name == "Ste") {
            form.getCheckBox("form1[0].#subform[2].P4_Line4b_Unit[1]").check();
        } else {
            form.getCheckBox("form1[0].#subform[2].P4_Line4b_Unit[1]").uncheck();
        }

        if (user.data.application.physicalaptsponsor_name == "Flr") {
            form.getCheckBox("form1[0].#subform[2].P4_Line4b_Unit[2]").check();
        } else {
            form.getCheckBox("form1[0].#subform[2].P4_Line4b_Unit[2]").uncheck();
        }
        if (user.data.application.physicalstesponsore_name) {
            form
            .getTextField("form1[0].#subform[2].P4_Line4b_AptSteFlrNumber[0]")
            .setText(
                user.data.application.physicalstesponsore_name?.toUpperCase()
            );
        }

        // City or town

        if (user.data.application.placemailingcity_name) {
            form
            .getTextField("form1[0].#subform[2].P4_Line4c_CityOrTown[0]")
            .setText(
                user.data.application.placemailingcity_name?.toUpperCase()
            );
        }

        // State

        if (user.data.application.usmailingprovinceinside_name) {
            form
            .getDropdown("form1[0].#subform[2].P4_Line4d_State[0]")
            .select(user.data.application.usmailingprovinceinside_name);
        }

        // Province

        if (user.data.application.mailingprovinceinsi_name) {
            form
            .getTextField("form1[0].#subform[2].P4_Line4f_Province[0]")
            .setText(
                user.data.application.mailingprovinceinsi_name?.toUpperCase()
            );
        }

        // Postal code

        if (user.data.application.gpostalcodeinsidemailin_name) {
            form
            .getTextField("form1[0].#subform[2].P4_Line4g_PostalCode[0]")
            .setText(
                user.data.application.gpostalcodeinsidemailin_name?.toUpperCase()
            );
        }

        // Zip Code

        if (user.data.application.mailingpostalcodezipin_name) {
            form
            .getTextField("form1[0].#subform[2].P4_Line4e_ZipCode[0]")
            .setText(
                user.data.application.mailingpostalcodezipin_name?.toUpperCase()
            );
        }

        // Country

        // if (user.data.application.placemailingcountry_name) {
        //   form.getTextField('form1[0].#subform[2].P4_Line4h_Country[0]').setText(user.data.application.placemailingcountry_name?.toUpperCase()
        //   );
        // }

        if (user.data.application.physicaladdresssponsor_name === "USA") {
            form
            .getTextField("form1[0].#subform[2].P4_Line4h_Country[0]")
            .setText("USA");
        } else if (
            user.data.application.physicaladdresssponsor_name !== "USA"
        ) {
            form
            .getTextField("form1[0].#subform[2].P4_Line4h_Country[0]")
            .setText(
                user.data.application.placemailingcountry_name?.toUpperCase()
            );
        }

        // Country of domicile

        if (user.data.application.sponsordomicile_name == "yes") {
            form
            .getTextField("form1[0].#subform[2].P4_Line5_CountryOfDomicile[0]")
            .setText("USA");
        } else {
            form
            .getTextField("form1[0].#subform[2].P4_Line5_CountryOfDomicile[0]")
            .setText("");
        }

        // Financial support

        if (!user.data.application.themostrecenttax_name) {
            form
            .getCheckBox("form1[0].#subform[4].P6_Line18a_Checkbox[1]")
            .check();
        } else {
            form
            .getCheckBox("form1[0].#subform[4].P6_Line18a_Checkbox[1]")
            .uncheck();
        }
        if (user.data.application.themostrecenttax_name) {
            form
            .getCheckBox("form1[0].#subform[4].P6_Line18a_Checkbox[0]")
            .check();
        } else {
            form
            .getCheckBox("form1[0].#subform[4].P6_Line18a_Checkbox[0]")
            .uncheck();
        }

        if (user.data.application.howmanyus_name) {
            form
            .getTextField("form1[0].#subform[3].P5_Line4_DependentChildren[0]")
            .setText(user.data.application.howmanyus_name?.toUpperCase());
        }

        if (user.data.application.howmanyustaxreturn_name) {
            form
            .getTextField("form1[0].#subform[3].P5_Line5_OtherDependents[0]")
            .setText(
                user.data.application.howmanyustaxreturn_name?.toUpperCase()
            );
        }

        if (user.data.application.howmanyuspermanentresidents_name) {
            form
            .getTextField("form1[0].#subform[3].P5_Line6_Sponsors[0]")
            .setText(
                user.data.application.howmanyuspermanentresidents_name?.toUpperCase()
            );
        }

        // Great! What's CHUKS's current individual annual income?

        if (user.data.application.greatcurrentindividualannual_name) {
            form
            .getTextField("form1[0].#subform[3].P6_Line2_TotalIncome[0]")
            .setText(
                user.data.application.greatcurrentindividualannual_name?.toUpperCase()
            );
        }
        if (user.data.application.ustexyear_name) {
            form
            .getTextField("form1[0].#subform[4].P6_Line19a_TaxYear[0]")
            .setText(
                user.data.application.ustexyear_name?.toUpperCase().slice(0, 4)
            );
        }
        if (user.data.application.ustotalincome_name) {
            form
            .getTextField("form1[0].#subform[4].P6_Line19a_TotalIncome[0]")
            .setText(user.data.application.ustotalincome_name?.toUpperCase());
        }
        if (user.data.application.usustexyear_name) {
            form
            .getTextField("form1[0].#subform[4].P6_Line19b_TaxYear[0]")
            .setText(
                user.data.application.usustexyear_name?.toUpperCase().slice(0, 4)
            );
        }
        if (user.data.application.usustotalincome_name) {
            form
            .getTextField("form1[0].#subform[4].P6_Line19b_TotalIncome[0]")
            .setText(user.data.application.usustotalincome_name?.toUpperCase());
        }
        if (user.data.application.usustexyearus_name) {
            form
            .getTextField("form1[0].#subform[4].P6_Line19c_TaxYear[0]")
            .setText(user.data.application.usustexyearus_name?.toUpperCase());
        }
        if (user.data.application.usustotalincomeus_name) {
            form
            .getTextField("form1[0].#subform[4].P6_Line19c_TotalIncome[0]")
            .setText(
                user.data.application.usustotalincomeus_name?.toUpperCase()
            );
        }

        if (user.data.application.admissionoccupation_name) {
            form
            .getTextField("form1[0].#subform[3].P6_Line4a_SelfEmployedAs[0]")
            .setText(
                user.data.application.admissionoccupation_name?.toUpperCase()
            );
        }

        if (
            Array.isArray(user.data.application.sponsoremploymentfiveyears_names)
        ) {
            if (
            user.data.application.sponsoremploymentfiveyears_names.length > 0
            ) {
            if (
                user.data.application.sponsoremploymentfiveyears_names[0]
                .admissionoccupation_name
            ) {
                form
                .getTextField(
                    "form1[0].#subform[3].P6_Line1a_NameofEmployer[0]"
                )
                .setText(
                    user.data.application.sponsoremploymentfiveyears_names[0].admissionoccupation_name?.toUpperCase()
                );
            }

            if (
                user.data.application.sponsoremploymentfiveyears_names[0]
                .admissiontown_name
            ) {
                form
                .getTextField(
                    "form1[0].#subform[3].P6_Line1a1_NameofEmployer[0]"
                )
                .setText(
                    user.data.application.sponsoremploymentfiveyears_names[0].admissiontown_name
                    ?.toUpperCase()
                    ?.slice(0, 34)
                );
            }
            }
        }

        if (user.data.application.abilitytomaintain_name == "yes") {
            form.getCheckBox("form1[0].#subform[4].P6_Line1_Employed[0]").check();
        } else {
            form
            .getCheckBox("form1[0].#subform[4].P6_Line1_Employed[0]")
            .uncheck();
        }

        // 1.a

        if (user.data.application.name) {
            form.getCheckBox("form1[0].#subform[9].P8_Line1_Checkbox[1]").check();
        }

        if (user.data.application.thereasonfornotfiling_name == "yes") {
            form
            .getCheckBox("form1[0].#subform[4].P6_Line20_Attached[0]")
            .check();
        }

        if (!user.data.application.employmenthistory_name) {
            form.getCheckBox("form1[0].#subform[3].P6_Line1_Checkbox[0]").check();
        }

        // Since when has CHUKS been unemployed?

        // if (user.data.application.employmentbeenunemployed_name) {
        // form.getTextField('form1[0].#subform[3].P6_Line6a_DateofUnemployment[0]').setText(user.data.application.employmentbeenunemployed_name);
        // }

        // if (user.data.application.employmentbeenunemployed_name) {
        // form.getTextField('form1[0].#subform[3].P6_Line6a_DateofUnemployment[0]').setText(user.data.application.employmentbeenunemployed_name);
        // }

        if (user.data.application.mailingpostalcode_name) {
            form
            .getTextField("form1[0].#subform[0].P2_Line2_ZipCode[0]")
            .setText(user.data.application.mailingpostalcode_name);
        }

        if (user.data.application.placemailingcountry_name) {
            form
            .getTextField("form1[0].#subform[2].P4_Line4h_Country[0]")
            .setText(
                user.data.application.placemailingcountry_name?.toUpperCase()
            );
        }
        if (user.data.application.ustexyear_name) {
            form
            .getTextField("form1[0].#subform[4].P6_Line19a_TaxYear[0]")
            .setText(user.data.application.ustexyear_name.slice(0, 4));
        }
        if (user.data.application.ustotalincome_name) {
            form
            .getTextField("form1[0].#subform[4].P6_Line19a_TotalIncome[0]")
            .setText(user.data.application.ustotalincome_name);
        }
        if (user.data.application.usustexyear_name) {
            form
            .getTextField("form1[0].#subform[4].P6_Line19b_TaxYear[0]")
            .setText(user.data.application.usustexyear_name.slice(0, 4));
        }
        if (user.data.application.usustotalincome_name) {
            form
            .getTextField("form1[0].#subform[4].P6_Line19b_TotalIncome[0]")
            .setText(user.data.application.usustotalincome_name);
        }
        if (user.data.application.usustexyearus_name) {
            form
            .getTextField("form1[0].#subform[4].P6_Line19c_TaxYear[0]")
            .setText(user.data.application.usustexyearus_name);
        }
        if (user.data.application.usustotalincomeus_name) {
            form
            .getTextField("form1[0].#subform[4].P6_Line19c_TotalIncome[0]")
            .setText(user.data.application.usustotalincomeus_name);
        }

        if (user.data.application.signaturedate_name) {
            form
            .getTextField("form1[0].#subform[20].P7Line9b_DateofSignature[0]")
            .setText(dateFormatter(user.data.application.signaturedate_name));
        }

        let src = `${__dirname}/pdf_forms/i-864_done.pdf`;
        const pdfBytes = await pdfDoc.save();
        fs.writeFileSync(src, Buffer.from(pdfBytes));
        res.sendFile(src);
        }
    });

}

const pdfDownload1145 = async (req, res) => {
   
    const existingPdfBytes = fs.readFileSync(`${__dirname}/pdf_forms/g-1145.pdf`);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const form = pdfDoc.getForm();
    //temp
    const fields = form.getFields();
    fields.forEach((field) => {
        const name = field.getName();
        console.log(`${name} `);
    });
    //temp
    Data.findOne({
        _id: req.params.user_id,
    }).exec(async function (err, user) {
        if (user) {
        if (user.data.application.family_name) {
            form
            .getTextField("form1[0].#subform[0].LastName[0]")
            .setText(user.data.application.family_name?.toUpperCase());
        }
        if (user.data.application.name) {
            form
            .getTextField("form1[0].#subform[0].FirstName[0]")
            .setText(user.data.application.name?.toUpperCase());
        }
        if (user.data.application.middle_name) {
            form
            .getTextField("form1[0].#subform[0].MiddleName[0]")
            .setText(user.data.application.middle_name?.toUpperCase());
        }
        if (user.data.application.emailaddressenot_name) {
            form
            .getTextField("form1[0].#subform[0].Email[0]")
            .setText(
                user.data.application.emailaddressenot_name?.toUpperCase()
            );
        }
        if (user.data.application.phonenumber_name) {
            form
            .getTextField("form1[0].#subform[0].MobilePhoneNumber[0]")
            .setText(user.data.application.phonenumber_name);
        }

        let src = `${__dirname}/pdf_forms/g-1145_done.pdf`;
        const pdfBytes = await pdfDoc.save();
        fs.writeFileSync(src, Buffer.from(pdfBytes));
        res.sendFile(src);
        }
    });

}

  

module.exports = { pdfDownload130, pdfDownload130a, pdfDownload131, pdfDownload485, pdfDownload765, pdfDownload864, pdfDownload1145 }

